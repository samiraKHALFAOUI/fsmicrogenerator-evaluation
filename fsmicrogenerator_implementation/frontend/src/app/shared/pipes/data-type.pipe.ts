import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dataType' })
export class DataTypePipe implements PipeTransform {
  transform(value: any , type :string): boolean {


    switch(type)
    {
     case 'empty' :
     return [null,undefined,'',[]].includes(value) ?true : ((Array.isArray(value) && value.length ==0) || ['string','number','boolean'].includes(typeof value) || (typeof value=='object' && (Object.keys(value).length ==0 && !(value instanceof Date))))
    case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && !(value && value instanceof Date) && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      case 'date':
        return value && value instanceof Date && !isNaN(value.valueOf());
      case 'integer':
        return Number.isInteger(value);
     default : return false
    }

  }
}
