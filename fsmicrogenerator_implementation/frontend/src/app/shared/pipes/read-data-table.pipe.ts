import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readDataTable',
})
export class ReadDataTablePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): any {
    if (!value) return value;

    let field: any = args[0];

    let recF = (field: any, data: any): any => {
      if (field.split('.').length === 1) return data[field];

      let newData = data[field.split('.')[0]];
      if (!newData) return newData;

      return newData instanceof Array
        ? newData.map((d: any) => recF(field.split('.').slice(1).join('.'), d))
        : recF(field.split('.').slice(1).join('.'), newData);
    };
    if (field)
      if (field.includes('$xor')) {
        let val = '';
        field.split(/\s*\$xor\s*/g).find(
          (f: any) =>
          (val = f.match(/\$(or|con(?:\(([^)]*)\))?cat)/)
            ? f
              .split(/\s*(\$or|\$con(?:\((?:[^)]*)\))?cat)\s*/g)
              .filter((v: any) => !v.match(/\$(or|con(?:\(([^)]*)\))?cat)/))
              .map((f: string) => recF(f, value))
              .join(field.match(/\s*\$con(?:\(([^)]*)\))?cat\s*/)?.[1] ?? ' ')
              ?.trim()
            : recF(f, value))
        );
        return val;
      } else {
        return field.match(/\$(or|con(?:\(([^)]*)\))?cat)/)
          ? field
            .split(/\s*(\$or|\$con(?:\((?:[^)]*)\))?cat)\s*/g)
            .filter(
              (v: any) =>
                v !== undefined && !v?.match?.(/\$(or|con(?:\(([^)]*)\))?cat)/)
            )
            .map((f: string) => recF(f, value))
            .join(field.match(/\s*\$con(?:\(([^)]*)\))?cat\s*/)?.[1] ?? ' ')
          : recF(field, value);
      }
  }
}
