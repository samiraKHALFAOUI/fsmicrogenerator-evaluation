import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  TitleCasePipe,
  UpperCasePipe,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Inject,
  LOCALE_ID,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { API } from '../services/defaultServices/api.service';

export type pipe =
  | { name: 'length' }
  | { name: 'date'; arguments?: string }
  | { name: 'titlecase' }
  | { name: 'currency'; arguments?: string }
  | { name: 'decimal'; arguments?: string }
  | { name: 'json' }
  | { name: 'lowercase' }
  | { name: 'uppercase' }
  | { name: 'percent'; arguments?: string }
  | {
    name: 'replace';
    arguments: {
      pattern: string;
      regexp?: boolean;
      replaceValue: any;
      flags?: string;
    };
  }
  | { name: 'map'; arguments: { [key: string]: any } }
  | { name: 'slice'; arguments: { start?: number; end?: number } }
  | {
    name: 'split';
    arguments: { pattern: string; regex?: boolean; flags?: string };
  }
  | { name: 'join'; arguments?: string }
  | { name: 'translate'; arguments?: any[] }
  | { name: 'file'; serviceName: string; default?: boolean }
  | { name: 'dynamic'; arguments: { [key: string]: any } };

@Pipe({
  name: 'genericPipe',
})
export class GenericPipe implements PipeTransform {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  transform(value: any, ...args: any[]): any {
    if (args[0]) {
      return args[0].reduce((prevVal: any, pipe: pipe) => {
        switch (pipe.name) {
          case 'length' :
            return prevVal instanceof Array || typeof prevVal === 'string'
              ? prevVal?.length
              : typeof prevVal === 'object'
                ? Object.keys(prevVal).length
                : 0;
          case 'date':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new DatePipe(this.locale).transform(val, pipe.arguments)
                )
                : new DatePipe(this.locale).transform(prevVal, pipe.arguments)
              : prevVal;

          case 'titlecase':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new TitleCasePipe().transform(String(val))
                )
                : new TitleCasePipe().transform(String(prevVal))
              : prevVal;

          case 'currency':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new CurrencyPipe(this.locale).transform(val, pipe.arguments)
                )
                : new CurrencyPipe(this.locale).transform(
                  prevVal,
                  pipe.arguments
                )
              : prevVal;

          case 'decimal':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) => typeof val === 'number' && prevVal % 1 != 0 ? new DecimalPipe(this.locale).transform(val, pipe.arguments) : val)
                : typeof prevVal === 'number' && prevVal % 1 != 0 ? new DecimalPipe(this.locale).transform(prevVal, pipe.arguments) : prevVal
              : prevVal;

          case 'json':
            return prevVal ? new JsonPipe().transform(prevVal) : prevVal;

          case 'lowercase':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new LowerCasePipe().transform(String(val))
                )
                : new LowerCasePipe().transform(String(prevVal))
              : prevVal;

          case 'uppercase':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new UpperCasePipe().transform(String(val))
                )
                : new UpperCasePipe().transform(String(prevVal))
              : prevVal;

          case 'percent':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  new PercentPipe(this.locale).transform(val, pipe.arguments)
                )
                : new PercentPipe(this.locale).transform(
                  prevVal,
                  pipe.arguments
                )
              : prevVal;

          case 'replace':
            return prevVal
              ? Array.isArray(prevVal)
                ? prevVal.map((val) =>
                  String(val).replace(
                    pipe.arguments.regexp
                      ? new RegExp(
                        pipe.arguments.pattern,
                        pipe.arguments.flags
                      )
                      : pipe.arguments.pattern,
                    pipe.arguments.replaceValue
                  )
                )
                : String(prevVal).replace(
                  pipe.arguments.regexp
                    ? new RegExp(pipe.arguments.pattern, pipe.arguments.flags)
                    : pipe.arguments.pattern,
                  pipe.arguments.replaceValue
                )
              : prevVal;

          case 'map':
            let options = pipe.arguments;
            for (let key of Object.keys(options)) {
              let val = options[key];

              if (val?.inc) {
                if (val.inc instanceof Array) {
                  val.inc.some((v: any) => value.includes(v)) && (value = key);
                } else {
                  value.includes(val.inc) && (value = key);
                }
              } else {
                if (val instanceof Array) {
                  val.some((v: any) => value === v) && (value = key);
                } else {
                  value === val && (value = key);
                }
              }
            }

            return value;

          case 'slice':
            return typeof prevVal === 'string'
              ? prevVal.substring(pipe.arguments.start || 0, pipe.arguments.end)
              : Array.isArray(prevVal)
                ? prevVal.slice(pipe.arguments.start || 0, pipe.arguments.end)
                : prevVal;

          case 'translate':
            return Array.isArray(prevVal)
              ? prevVal.map((val) =>
                new TranslatePipe(
                  this.translateService,
                  this.changeDetectorRef
                ).transform(String(val), pipe.arguments)
              )
              : new TranslatePipe(
                this.translateService,
                this.changeDetectorRef
              ).transform(String(prevVal), pipe.arguments);

          case 'split':
            return String(prevVal).split(
              pipe.arguments.regex
                ? new RegExp(pipe.arguments.pattern, pipe.arguments.flags)
                : pipe.arguments.pattern
            );

          case 'join':
            return Array.isArray(prevVal)
              ? prevVal.join(pipe.arguments)
              : prevVal;

          case 'file':
            if (prevVal && prevVal.startsWith('http'))
              return prevVal
            if (prevVal) {
              if (prevVal instanceof Array) {
                prevVal = prevVal.map(
                  (p) =>
                  (p =
                    p.split('/')[0] === 'assets'
                      ? p
                      : `${API}/${pipe.serviceName}Service${p}`)
                );
              } else {
                prevVal =
                  prevVal.split('/')[0] === 'assets'
                    ? prevVal
                    : `${API}/${pipe.serviceName}Service${prevVal}`;
              }
            } else if (pipe.default) {
              prevVal = `assets/images/${pipe.serviceName}/default_${pipe.serviceName}.png`;
            } else {
              prevVal = '';
            }
            //

            return prevVal;

          case 'dynamic':
            if (prevVal && prevVal != '') {
              if (typeof prevVal === 'string') {
                if (new Date(prevVal).getFullYear()) {
                  if (
                    new Date(prevVal).getHours() === 0 &&
                    new Date(prevVal).getMinutes() === 0 &&
                    new Date(prevVal).getSeconds() === 0
                  ) {
                    //

                    return new DatePipe(this.locale).transform(
                      prevVal,
                      'dd/MM/yyyy'
                    );
                  } else {
                    //
                    return new DatePipe(this.locale).transform(
                      prevVal,
                      'HH:mm:ss'
                    );
                  }
                }
              }
            }
            return prevVal;
          // case '':
          //   return new ().transform(prevVal, pipe.arguments);

          default:
            return prevVal;
        }
      }, value);
    }

    return value;
  }
}
