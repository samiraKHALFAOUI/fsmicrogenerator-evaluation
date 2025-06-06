

import { Injectable } from '@angular/core';
import { HelpersService } from './helpers.service';
import "src/assets/fonts/amiri_font.js";
import "src/assets/fonts/amiri_bold.js";

import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "@angular/common";
import { StatistiqueHelpersService } from './statistiqueHelpers.service';
import { SecureStorageService } from './secureStorage.service';

@Injectable({
  providedIn: 'root',
})
export class StatistiqueExporterService {

  statistiqueHeader: any = [
    'code_17993',
    'code_17992', 'code_13895'
    // { code: "statistique.bilan", label: "" },
    // { code: "statistique.centre", label: "" },
    // { code: "code_1", label: "" },

    /* { code: "ajouter.periode", label: "" },
     { code: "statistique.genereLe", label: "" }, */
    // { code: "statistique.guichet", label: "" }
  ];
  titleNumerotation: any = { h1: 0, h2: 0 }
  lang: any = 'fr'
  topMarge: number = 35
  constructor(private helpers: HelpersService,
    private statistiqueHelpersService: StatistiqueHelpersService,
    private secureStorage: SecureStorageService
  ) {

    Promise.all([this.helpers.translateValues(this.statistiqueHeader)]).then((result) => {
      let codes: any = {}
      result[0].map((r: any) => codes[r.value] = this.helpers.titleCase(r.label))
      this.statistiqueHeader = codes
      this.lang = this.secureStorage.getItem('lang',true)
    })
  }
  //#region exportToPdf

  isExpanded = false;
  show = true;
  showLoadingIndicator = false;

  addHeaderAndFooter(doc: any) {
    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.text(
      this.text.header,
      (pageWidth - doc.getTextWidth(this.text.header)) / 2,
      15
    );

    // Footer
    let str = "" + doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(100);
    // jsPDF 1.4+ uses getWidth, <1.4 uses .width

    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(10);
    doc.setTextColor(100);
    if (this.lang === "ar") {
      doc.text(str, 10, pageHeight - 10);
      doc.text(
        this.text.footer,
        pageWidth - 20 - doc.getTextWidth(this.text.footer),
        pageHeight - 10
      );
    } else {
      doc.text(this.text.footer, 10, pageHeight - 10);
      doc.text(str, pageWidth - 20, pageHeight - 10);
    }
  }
  loadImage(path: any, pageWidth: any, padding: any) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = async function () {
        let imageWidth = img.width;
        let imageHeight = img.height;
        if (imageWidth > pageWidth) {
          const ratio = pageWidth / imageWidth;
          imageHeight = imageHeight * ratio - padding;
          imageWidth = imageWidth * ratio - padding;
        }

        let x = (pageWidth - imageWidth) / 2;
        resolve({ img, x, imageWidth, imageHeight });
      };
    });
  };
  createPageGarde(doc: any, titre: string, periode: any) {
    const annajdaLogo = `assets/images/logo/logo_${this.lang === "ar" ? "ar" : "fr"}.png`;
    const logoProjet = `assets/images/statistiqueExport/slogan.jpeg`;
    const header = `assets/images/statistiqueExport/header.jpeg`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const DateNow = formatDate(Date.now(), "dd/MM/yyyy HH:mm", "en-US");

    let title = `${this.statistiqueHeader['code_17993']}: ${titre} `;
    let subTitles = [];
    /* subTitles.push(
        `${this.statistiqueHeader[1].label}: ${
          this.centreAnnajda === 0
            ? this.statistiqueHeader[2].label
            : this.listCentre.find((c) => c.id === this.centreAnnajda).label
        }`
     );*/
    if (periode && periode != 'global') {
      subTitles.push(`${this.statistiqueHeader['code_13895']}: ${this.statistiqueHelpersService.getSubTitle(periode)}`);
    }
    subTitles.push(`${this.statistiqueHeader['code_17992']}: ${DateNow}`);

    return new Promise((resolve) => {
      Promise.all([
        this.loadImage(annajdaLogo, pageWidth, this.topMarge),
        this.loadImage(logoProjet, pageWidth, 0),
        this.loadImage(header, pageWidth, 0)
      ]).then((res: any) => {
        doc.addImage(
          res[2]["img"],
          "PNG",
          res[2]["x"],
          10,
          res[2]["imageWidth"],
          res[2]["imageHeight"] / 2
        );
        let lastPosition = res[2]["imageHeight"] / 2 + 40;
        doc.addImage(
          res[0]["img"],
          "PNG",
          res[0]["x"],
          lastPosition,
          res[0]["imageWidth"],
          res[0]["imageHeight"]
        );

        lastPosition += res[0]["imageHeight"] + 20;
        let text = title;
        doc.setFontSize(25);

        let textX = (pageWidth - doc.getTextWidth(text)) / 2;

        doc.text(text, textX, lastPosition);
        for (let title of subTitles) {
          doc.setFontSize(20);
          lastPosition += 35;
          text = title;
          textX = (pageWidth - doc.getTextWidth(text)) / 2;
          doc.text(text, textX, lastPosition);
        }
        lastPosition += 40;
        doc.addImage(
          res[1]["img"],
          "PNG",
          res[1]["x"],
          lastPosition,
          res[1]["imageWidth"],
          res[1]["imageHeight"]
        );
        doc.addPage();
        this.addHeaderAndFooter(doc);
        resolve("ok");
      });
    });
  }
  text = { header: "", footer: "" };
  async exportToPDF(titre: string, periode: any, id: string) {
    let doc = new jsPDF("p", "px");
    this.titleNumerotation = { h1: 0, h2: 0 }

    doc.setFont("Amiri-Regular");
    this.text.header = 'header';
    this.text.footer = 'footer'
    const readContent = async (item: HTMLElement, top: number, padding: number, arabicTable: any, cardBody: boolean = false) => {
      if (item) {

        if (cardBody) {
          if (item.className.includes('bodyTabs')) {
            let tabItem = item.querySelectorAll('.tabItem')
            for (let i = 0; i < tabItem.length; i++) {
              let header = item.querySelector('.tabItem-header')?.querySelector('.card-title')
              // let subHeader = item.querySelector('.tabItem-header')?.querySelector('.card-subtitle')?.textContent
              let body = item.querySelector('.tabItem-body')?.querySelectorAll('.reportDetail')
              if (body) {
                top = await this.addTitleSection(doc, header, top, padding, 'h2')
                // top = await this.addTitleSection(doc, subHeader, top, padding, 'h4')
                for (let i = 0; i < body.length; i++)
                  top = await this.writeReport(doc, body.item(i), top, padding)
              }
            }
          } else {
            let items: any = item.getElementsByClassName('body-item')
            for (let i = 0; i < items.length; i++) {
              let elt = items.item(i) as HTMLElement
              if (elt) {
                if (elt.className.includes('chart')) {
                  top = await this.addChartImageToPDF(doc, elt.getElementsByClassName('dynamicChart')[0], top, i, padding);
                } else if (elt.className.includes('table')) {
                  top = await this.addTableToPDF(
                    doc,
                    elt.querySelector('table'),
                    top,
                    arabicTable,
                    padding
                  );
                }
              }
            }

            items = item.querySelectorAll('.reportDetail')
            if (items && items.length) {
              for (let i = 0; i < items.length; i++)
                top = await this.writeReport(doc, items.item(i), top, padding)
            }
          }
        }
        else if (item.children.length) {
          for (let i = 0; i < item.children.length; i++) {
            const child = item.children.item(i) as HTMLElement;
            if (child.className.includes('generalCount')) {

              top = await this.addCanvasElement(doc, child, top, padding)
            } else if (child.className.includes('card-header')) {

              top = await this.addTitleSection(doc, child, top, padding)
              top = await this.addTitleSection(doc, child.querySelector('.card-subtitle')?.textContent || '', top, padding, 'h4')

            } else if (child.className.includes('card-body')) {

              top = await readContent(child, top, padding, arabicTable, true)
            } else if (child.className.includes('dynamicChart') || ['app-map-chart', 'app-dynamic-apex-chart', 'app-dynamic-charts'].includes(child.tagName.toLowerCase())) {
              top = await this.addTitleSection(doc, child.getElementsByClassName('dynamicChart')[0]?.querySelector('.highcharts-title')?.textContent, top, padding)
              top = await this.addTitleSection(doc, child.getElementsByClassName('dynamicChart')[0]?.querySelector('.highcharts-subtitle')?.textContent || '', top, padding, 'h4')
              top = await this.addChartImageToPDF(doc, child.getElementsByClassName('dynamicChart')[0], top, i, padding);
            }
            else if (child.className.includes('chartTable') || child.tagName.toLowerCase() === 'app-chart-table') {
              top = await this.addTableToPDF(
                doc,
                child.className.split(" ")[1],
                top,
                arabicTable,
                padding
              );
            }

          }
        }
      }
      return top
    };

    return this.helpers.resolve((res, rej) => {
      const docBloc = document.getElementById(id)
      if (docBloc) {

        this.createPageGarde(doc, titre, periode).then(async (result) => {
          let top = this.topMarge;
          const padding = 10;

          const elements = docBloc.getElementsByClassName('statContent');
          const arabicTable = this.secureStorage.getItem('lang',true) === 'ar';
          const pageHeight = doc.internal.pageSize.getHeight();


          for (let i = 0; i < elements.length; i++) {
            const el = elements.item(i) as HTMLElement;
            top = await readContent(el, top, padding, arabicTable)



          }


          doc.save(`${this.text.header.replace(": ", "_")}.pdf`);
          res('end success')

        }).catch((error) => {
          rej(error)
        })
      } else {
        console.error(`id : ${id} not found`)
        rej(`id : ${id} not found `)
      }



    })
  }
  async writeReport(doc: any, element: any, top: any, padding: any) {
    try {
      let title = element.querySelector('.report-title')?.textContent
      let y = top
      if (title)
          y = await this.addTitleSection(doc, title, top, padding, 'h3')
          y += 20

      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Loop through each list item
      const listItems = element.querySelectorAll('li');




      for (let elt of listItems) {
        let item = elt as HTMLElement;
        const img = item.querySelector('.item-img') as HTMLImageElement | null;
        const icon = item.querySelector('.item-icon')?.textContent || '';
        const label = item.querySelector('.item-label')?.textContent || '';
        const details = Array.from(item.querySelectorAll('.item-details')).map(
          (detail) => detail.textContent || ''
        );
        const value = item.querySelector('.item-value')?.textContent || '';
        const suffix = item.querySelector('.item-suffix')?.textContent || '';
        doc.setFontSize(14)
        let textHeight = doc.getTextDimensions(label).h;
        doc.setFontSize(10)
        details.map((d, i) => textHeight += doc.getTextDimensions(d).h + 10 + i * 5)
        doc.setFontSize(14)

        let imgHeight = 0;

        let dataImg: any
        if (img) {
          dataImg = await this.loadImage(img.currentSrc || img.src || img, this.topMarge, padding);

          imgHeight = dataImg.imageHeight;


        }
        const maxHeight = Math.max(imgHeight, textHeight);

        if (y + maxHeight > pageHeight - 20) {
          doc.addPage();
          y = this.topMarge;
          this.addHeaderAndFooter(doc);
        }


        // Align text and value vertically with the image
        const centerAlignment = y + maxHeight / 2;
        const imgY = imgHeight > textHeight ? y : centerAlignment - imgHeight / 2;
        const textY = textHeight > imgHeight ? y : centerAlignment + textHeight / 4;


        let textX = padding + 15
        // Add the image to the PDF if available
        if (img && dataImg) {
          let imgPadding = padding + 15
          doc.addImage(
            dataImg["img"],
            "PNG",
            imgPadding,
            textY - doc.getTextDimensions(label).h,// imgY
            dataImg['imageWidth'],
            imgHeight
          );

          textX = imgPadding + dataImg['imageWidth'] + 5
        } else if (icon) {
          doc.setDrawColor(0); // Border color
          doc.setFillColor(200, 200, 200); // Background color
          doc.circle(20, y + 5, 5, 'F'); // Draw icon circle
          doc.setFontSize(10);
          doc.text(icon, 18, y + 7);
          textX = padding + 18
        }

        // Add label text
        doc.setFontSize(14);
        doc.text(label, textX, textY);
        // Add value and suffix text
        const data = value + suffix;
        doc.text(data, pageWidth - doc.getTextWidth(data) - padding, textY);



        // Add details below the main text
        let detailY = textY;
        doc.setFontSize(10);
        details.forEach((detail: string, index: number) => {
          detailY = textY + 10 + index * 5
          doc.text(detail, textX, detailY);

        });
        detailY = textY < detailY ? detailY : textY

        y = detailY + 25
      }


      return y
    } catch (error) {
      console.error('write report ===>', error)
    }
  }
  async addTitleSection(doc: any, element: any, top: any, padding: any, titleLevel: string = 'h1') {
    try {
      let value = typeof element === 'string' ? element : (element.querySelector('h5')?.textContent || '')
      value = value.trim()
      if (value) {
        doc.setFont("Amiri Bold")
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let size = 20
        let textX = (pageWidth - doc.getTextWidth(value)) / 2;
        let titleNumber: any
        switch (titleLevel) {
          case 'h1': size = 18; top += 20; textX = padding + 5; this.titleNumerotation['h1']++; this.titleNumerotation['h2'] = 0; titleNumber = `${this.titleNumerotation['h1']}.`; break;
          case 'h2': size = 16; top += 15; textX = padding + 10; this.titleNumerotation['h2']++; titleNumber = `${this.titleNumerotation['h1']}.${this.titleNumerotation['h2']}.`; break;
          case 'h3': size = 14; top += 15; textX = padding + 15; break;
          case 'h4': size = 10; top += 5; textX = padding + 10; break;
        }

        if (top > pageHeight - 20) {
          doc.addPage();
          top = this.topMarge;
          this.addHeaderAndFooter(doc);
        }
        doc.setFontSize(size)
        if (titleLevel === 'h3') {
          doc.circle(textX, top - 2, 1.5, "F");
          textX += 5
        } else if (titleNumber) {
          const value = titleNumber.toString()
          doc.text(value, textX, top)
          textX += doc.getTextWidth(value) + 3
        }

        doc.text(value, textX, top);
        top += 10
        doc.setFont("Amiri-Regular")
      }

    } catch (error) {
      console.error('**** error while adding title Section ****', error)
    }
    return top
  }

  async addCanvasElement(doc: any, element: any, top: any, padding: any) {
    try {
      const imgData = await htmlToImage.toPng(element);
      let elHeight = element.offsetHeight;
      let elWidth = element.offsetWidth;
      const pageWidth = doc.internal.pageSize.getWidth();

      let position = top || this.topMarge;
      if (elWidth > pageWidth) {
        const ratio = pageWidth / elWidth;
        elHeight = elHeight * ratio - padding;
        elWidth = elWidth * ratio - padding;
      }

      const pageHeight = doc.internal.pageSize.getHeight();

      if (position + elHeight > pageHeight - 12) {
        doc.addPage();
        position = this.topMarge;
        this.addHeaderAndFooter(doc);
      }

      await doc.addImage(
        imgData,
        "PNG",
        padding,
        position,
        elWidth,
        elHeight,
        `canvasImage${this.helpers.random()}`
      );
      position += elHeight + 10;

      return position;
    } catch (error) {
      console.error('**** error while adding canva element ****', error)
    }
  }
  async addChartImageToPDF(doc: any, element: any, top: any, index: any, padding: any) {
    try {
      const imgData = await htmlToImage.toPng(element);
      let elHeight = element.offsetHeight;
      let elWidth = element.offsetWidth;
      const pageWidth = doc.internal.pageSize.getWidth();

      let position = top || this.topMarge;
      if (elWidth > pageWidth) {
        const ratio = pageWidth / elWidth;
        elHeight = elHeight * ratio - padding;
        elWidth = elWidth * ratio - padding;
      }

      const pageHeight = doc.internal.pageSize.getHeight();

      if (position + elHeight > pageHeight - 12) {
        doc.addPage();
        position = this.topMarge;
        this.addHeaderAndFooter(doc);
      }

      await doc.addImage(
        imgData,
        "PNG",
        padding,
        position,
        elWidth,
        elHeight,
        `image${this.helpers.random() + index}`
      );
      position += elHeight + 10;

      return position;
    } catch (error) {
      console.error('**** error while adding chart image ****', error)
    }
  }

  async addTableToPDF(doc: any, tableID: any, position: any, arabic: any, padding: any) {
    try {
      let table = typeof tableID === 'string' ? document.getElementById(tableID) : tableID;
      if (table && table.tagName === "TABLE") {
        if (arabic) {
          const rtlTable = (await table.cloneNode(true)) as HTMLTableElement;

          if (rtlTable) {
            for (let tr of Array.from(rtlTable.querySelectorAll("tr"))) {
              const tds = Array.from(tr.querySelectorAll("td, th")).reverse();
              for (let td of tds) tr.appendChild(td);
            }
          }

          table = rtlTable;
        }
        const didDrawPageCallback = (data: any) => {
          this.addHeaderAndFooter(doc);
        };
        await autoTable(doc, {
          html: table as HTMLTableElement,
          headStyles: {
            fillColor: "#007bff",//"#8e0356",
            textColor: "#ffffff",
            font: "Amiri-Regular"
          },
          styles: {
            lineColor: "#c7c7c7",
            lineWidth: 0,

            font: "Amiri-Regular"
          },
          startY: position,
          pageBreak: "avoid",
          rowPageBreak: "avoid",
          didDrawPage: didDrawPageCallback
        });

        position = doc.lastAutoTable.finalY + padding;
      }

      return position;
    } catch (error) {
      console.error('**** error while adding table ****', error)
    }
  }

}
