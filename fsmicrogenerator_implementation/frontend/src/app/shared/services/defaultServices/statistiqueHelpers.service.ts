import { Injectable } from '@angular/core';
import { HelpersService } from './helpers.service';
import { API } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class StatistiqueHelpersService {

  usedCodes: any = [
    'code_4312',
    'code_4311',
    'code_1191',
    'code_4310',
  ]
  constructor(private helpers: HelpersService) {

    Promise.all([this.helpers.translateValues(this.usedCodes)]).then((result) => {
      let codes: any = {}
      result[0].map((r: any) => codes[r.value] = this.helpers.titleCase(r.label))
      this.usedCodes = codes
    })
  }


  getDatePipline(type: string, field: any, dataProjection: any) {
    let _id: any
    let sort: any
    switch (type) {
      case 'year': _id = { year: { $year: `$${field}` } };
        sort = { "_id.year": 1 };
        break;
      case 'month': _id = { year: { $year: `$${field}` }, month: { $month: `$${field}` } };
        sort = { "_id.year": 1, "_id.month": 1 };
        break;
      case 'week': _id = { year: { $year: `$${field}` }, week: { $week: `$${field}` } };
        sort = { "_id.year": 1, "_id.week": 1 };
        break;
      case 'day': _id = { year: { $year: `$${field}` }, month: { $month: `$${field}` }, day: { $dayOfMonth: `$${field}` } };
        sort = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
        break;

    }

    let result: any = { configuration: { $group: { _id, count: { $sum: 1 } } }, options: { $sort: sort } }
    if (dataProjection) {
      let projection: any = {}
      dataProjection.map((d: any) => projection[d.key] = typeof d.value === 'string' ? `$${d.value}` : d.value)
      result.configuration['$group']['data'] = { $push: projection }
    }

    return result
  }

  getPeriode(date: Date | Date[], type: 'month' | 'year' | 'date') {

    let from = date
    let to
    if (date instanceof Array) {
      from = new Date(date[0].setHours(0, 0, 0, 0))
      to = new Date(date[1].setHours(23, 59, 59, 999))
    } else {
      if (type === 'month') {

        from = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
        to = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)


      } else {
        from = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)
        to = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999)
      }
    }

    return { from, to }

  }

  getSubTitle(periode: any) {
    let subTitle = ''
    if (periode.from && periode.to) {
      subTitle = `${this.usedCodes['code_4312']}: ${this.helpers.formatDate(periode.from)}  ${this.usedCodes['code_4311']}: ${this.helpers.formatDate(periode.to)}`
    } else if (periode.from) {
      subTitle = `${this.usedCodes['code_1191']}: ${this.helpers.formatDate(periode.from)}`
    } else {
      subTitle = `${this.usedCodes['code_4310']}: ${this.helpers.formatDate(periode.to)}`
    }
    return subTitle
  }

  getDateCondition(periode: any, item: any, periodeCondition: any = {}, dateAttribut: string[] | string = 'dateTransaction') {

    if (periode && periode != 'global' && (periode.from || periode.to)) {
      item.subTitle = this.getSubTitle(periode)
      item['fromDate'] = periode.from ? new Date(new Date(periode.from).setHours(0, 0, 0, 0)) : null
      item['toDate'] = periode.to ? new Date(new Date(periode.to).setHours(23, 59, 59, 999)) : null
      if (typeof dateAttribut === 'string') {
        periodeCondition[dateAttribut] = {}
        if (periode.from)
          periodeCondition[dateAttribut]['$gte'] = item['fromDate']
        if (periode.to)
          periodeCondition[dateAttribut]['$lte'] = item['toDate']
      } else if (dateAttribut instanceof Array && dateAttribut.length) {
        dateAttribut.map((d) => {
          periodeCondition[d] = {}
          if (periode.from)
            periodeCondition[d]['$gte'] = item['fromDate']
          if (periode.to)
            periodeCondition[d]['$lte'] = item['toDate']
        })
      }


      periode = `${this.helpers.formatDate(periode.from, 'date')}-${this.helpers.formatDate(periode.to, 'date')}`
    } else {
      item.subTitle = null
      periode = 'global'
    }

    return periode

  }

  addMissingDates(data: any = [], attribut: string = '_id') {

    const completeData = [];
    if (data.length) {
      // Trier les données par date pour s'assurer de l'ordre
      data.sort((a: any, b: any) => new Date(a[attribut]).getTime() - new Date(b[attribut]).getTime())
      // Récupérer la première et la dernière date de la plage
      const startDate = new Date(data[0][attribut]);
      const endDate = new Date(data[data.length - 1][attribut]);

      // Créer un tableau pour stocker les données complètes avec les dates manquantes

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Chercher si la date existe dans les données d'origine
        const existingEntry = data.find((entry: any) => entry[attribut] === dateStr);

        if (existingEntry) {
          // Si la date existe, l'ajouter telle quelle
          completeData.push(existingEntry);
        } else {
          // Sinon, ajouter une entrée avec `count: 0`
          completeData.push({ _id: dateStr, count: 0 });
        }

        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return completeData;
  }

  getImage(value: any, serviceName: string, defaultImage: string | null = null) {
    let newVal = null
    if (!serviceName && !defaultImage) {
      return null
    }
    if (value) {
      if (value instanceof Array) {
        newVal = value.map(
          (p) =>
          (p =
            p.split('/')[0] === 'assets'
              ? p
              : `${API}/${serviceName}Service${p}`)
        );
      } else {
        newVal =
          value.split('/')[0] === 'assets'
            ? value
            : `${API}/${serviceName}Service${value}`;
      }
    } else if (!defaultImage) {
      return null
    } else {
      newVal = `assets/images/${serviceName}/default_${defaultImage}.png`;
    }
    return newVal;
  }


}
