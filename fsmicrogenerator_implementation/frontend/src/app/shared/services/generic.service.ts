import { Injectable } from "@angular/core";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { from, Observable } from "rxjs";
import { HelpersService } from "./defaultServices/helpers.service";
import { UserService } from "./AccountManagement/user.service";
import { GroupService } from "./AccountManagement/group.service";
import { SecureStorageService } from "./defaultServices/secureStorage.service";

@Injectable({
  providedIn: "root",
})
export class GenericService {
  routes: any[] = [];
  dataModels: any[] = [];
  constructor(
    private apiService: APIService,
    private helpers: HelpersService,
    private userService: UserService,
    private groupService: GroupService,
    private secureStorage: SecureStorageService,
  ) {
    this.routes = this.secureStorage.getItem("global_espace") || [];
  }
  getModel() {
    this.getModelsName().subscribe({
      next: (models: any[]) => {
        models = models.map(
          (m: any) =>
            (m = {
              label: m[0].service,
              value: m[0].service,
              items: m.map(
                (item: any) =>
                  (item = { service: m[0].service, classe: item.value })
              ),
            })
        );
        this.dataModels.splice(0, this.dataModels.length, ...models);
      },
    });
  }
  get(service: string): Observable<any> {
    switch (service) {
      case "user":
        return this.userService.getUsers();
      case "group":
        return this.groupService.getGroups();

      default:
        return from([]);
    }
  }

  getRoute(module: string, component: string, operation: string) {
    let items = [];
    if (!this.routes.length) {
      this.routes = this.secureStorage.getItem("global_espace") || [];
    }
    if (this.routes.length) {
      items = this.routes.find(
        (r: any) => r.path === `${module}` || r.path === `${module}s`
      )?.children;
      if (items?.length) {
        items = items.find((r: any) => r.type === component)?.children;
      }
      if (items?.length) {
        items = items.filter((r: any) => ["list", operation].includes(r.type));
      }
    } else {
    }
    return items;
  }

  getModelsName(specifiqueServices: string[] = []) {
    let services = specifiqueServices.length
      ? specifiqueServices
      : [
          "accountManagementService",
          "memberService",
          "caracteristiqueService" /*,'taxonomieService'*/,
        ];
    let getData = (serviceName: string) => {
      return this.helpers.resolve<any[]>((res, rej) => {
        this.apiService
          .get<any[]>(`${serviceName}/mongooseModel/modelsName`)
          .subscribe({
            next: (result: any) => {
              result = result.map(
                (r: any) =>
                  (r = r.pseudo ? { value: r.pseudo, label: r.pseudo } : r)
              );
              res(result);
            },
            error: ({ error }: any) => {
              console.error("error", error);
              rej(error);
            },
          });
      });
    };
    return from(Promise.all(services.map((s) => getData(s))));
  }
  filterObjetConcerne(data: any[]) {
    let filterList = ["trace", "operationEffectuee"];
    if (data instanceof Array) {
      let newData: any = [];
      for (let d of data) {
        if (d instanceof Array) {
          newData.push(...d.filter((i) => !filterList.includes(i.value)));
        } else if (!filterList.includes(d.value)) newData.push(d);
      }
      newData = newData.sort((a: any, b: any) => (a.label > b.label ? 1 : -1));
      return newData;
    }
    return [];
  }
  getObjectsByType(params: { [key: string]: any }) {
    return this.get(params["modelName"]);
  }
  transformObjetConcerne(data: any) {
    if (data instanceof Array) {
      let newData: any = [];
      data.map((d: any) =>
        newData.push({
          _id: d._id,
          value: d._id,
          label:
            d.translations?.title ||
            d.translations?.titre ||
            d.translations?.designation ||
            d.translations?.titre ||
            d.translations?.label ||
            d.translations?.nom ||
            d.translations?.name ||
            d.translations?.description ||
            d._id,
        })
      );
      return newData;
    } else {
      return data
        ? {
            _id: data._id,
            value: data._id,
            label:
              data.translations?.title ||
              data.translations?.titre ||
              data.translations?.designation ||
              data.translations?.titre ||
              data.translations?.label ||
              data.translations?.nom ||
              data.translations?.name ||
              data.translations?.description ||
              data._id,
          }
        : null;
    }
  }
  transformObjetConcernesToGroup(
    objetConcernes: any[],
    optionObjetConcerne: any[]
  ) {
    let i;
    objetConcernes.map((objet: any) => {
      i = optionObjetConcerne.findIndex(
        (o) => o.label === objet.typeObjetOrigineActivite
      );
      if (i === -1) {
        optionObjetConcerne.push({
          label: objet.typeObjetOrigineActivite,
          value: objet.typeObjetOrigineActivite,
          items: [
            {
              label: objet.referenceObjet,
              value: objet._id,
            },
          ],
        });
      } else {
        optionObjetConcerne[i].items.push({
          label: objet.referenceObjet,
          value: objet._id,
        });
      }
    });
  }
  //#region
  getModelsNameByServices(specifiqueServices: string[] = []) {
    let services = specifiqueServices.length
      ? specifiqueServices
      : [
          "modeleGeneratifService",
          "memberService",
          "caracteristiqueService",
          "taxonomieService",
        ];
    let getData = (serviceName: string) => {
      return this.helpers.resolve<any>((res, rej) => {
        this.apiService
          .get<any[]>(`${serviceName}/mongooseModel/modelsName`)
          .subscribe({
            next: (result: any) => {
              let data: any = {};
              data[serviceName] = result;
              res(data);
            },
            error: ({ error }: any) => {
              console.error("error", error);
              rej(error);
            },
          });
      });
    };
    return from(Promise.all(services.map((s) => getData(s))));
  }

  getModelsAttributs(serviceName: string, modelName: string) {
    return this.apiService.get<any[]>(
      `${serviceName}/mongooseModel/attributs?params=${modelName}`
    );
  }
  //#endregion
}
