import { Injectable } from "@angular/core";
import { Group } from "src/app/shared/models/AccountManagement/Group.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { SecureStorageService } from "../defaultServices/secureStorage.service";
import { MenuService } from "../TechnicalConfiguration/menu.service";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  groupUrl = `/accountManagementService/groups`;
  etatUtilisation: any = ["code_4316", "code_4317"];
  constructor(private apiService: APIService,
    private helpers: HelpersService,
    private menuService: MenuService,
    private secureStorage: SecureStorageService) {
    //translate i18n values for dropdown options
    Promise.all(
      [this.helpers.translateValues(this.etatUtilisation)]
    )
      .then((result) => {
        this.etatUtilisation = result[0];
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getGroups(params?: { [key: string]: any }) {
    return this.apiService.get<Group[]>(
      `${this.groupUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getGroupById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Group>(
      `${this.groupUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneGroup(params?: { [key: string]: any }) {
    return this.apiService.get<Group>(
      `${this.groupUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesGroup(configuration: any) {
    return this.apiService.post<any>(
      `${this.groupUrl}/statistiques`,
      configuration
    );
  }

  addGroup(group: any) {
    return this.apiService.post<Group>(`${this.groupUrl}`, group);
  }

  addManyGroup(group: any) {
    return this.apiService.post<Group[]>(`${this.groupUrl}/many`, group);
  }

  getGroupForTranslation(id: string) {
    return this.apiService.get<Group>(`${this.groupUrl}/translate/${id}`);
  }

  translateGroup(id: string, group: any) {
    return this.apiService.patch<{ message: string; data: Group }>(
      `${this.groupUrl}/translate/${id}`,
      group
    );
  }

  updateGroup(id: string, group: any) {
    return this.apiService.patch<{ message: string; data: Group }>(
      `${this.groupUrl}/${id}`,
      group
    );
  }

  updateManyGroup(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.groupUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.groupUrl}/`,
      data
    );
  }
  //#region helpers
  checkEspace() {
    let canAccess = false;
    let espaces = this.secureStorage.getItem("global_espace", true) || []
    let user = this.secureStorage.getItem("user",true) || {}
    if (user._id && !user.groupe.superGroup) {
      let mySpaces = user.groupe?.espaces;
      const recF = (espace: any) => {
        let newEspace: any;
        let e = mySpaces.find(
          (e: any) => e.espace === espace.espace || e.path === espace.path
        );
        if (e) {
          newEspace = { ...espace, children: [] };
          if (espace.children?.length) {
            for (let child of espace.children) {
              child = recF(child);
              if (child) {
                newEspace.children.push(child);
              }
            }
          }
        }

        return newEspace;
      };
      let newEspaces: any = [];

      espaces.map((me: any) => {
        let nme = recF(me);
        if (nme) {
          newEspaces.push(nme);
        }
      });
      espaces = newEspaces.filter((e: any) => e);
    }
    espaces = this.menuService.espacesToTree(espaces);
    if (espaces.find((e: any) => !e.data.canAccess)) {
      canAccess = false;
    } else {
      canAccess = true;
    }

    return { espaces, canAccess };
  }
  patchEspace(espaces: any[], formEspace: any[]) {
    this.helpers
      .flatDeep(espaces, "children")
      .filter((e: any) =>
        formEspace.find((d: any) => {
          return d.espace === e.data.espace && d.path === e.data.path;
        })
      )
      .map((e: any) => (e.data.canAccess = true));

    if (espaces.filter((e: any) => !e.data.canAccess).length) {
      return false;
    } else {
      return true;
    }
  }

  handleChange(espaces: any[], canAccess: boolean, event: any, data: any) {
    if (data && data.node.children.length) {
      this.helpers
        .flatDeep(data.node.children, "children")
        .map((c: any) => (c.data.canAccess = event.checked));
    } else if (!data) {
      this.helpers
        .flatDeep(espaces, "children")
        .map((c: any) => (c.data.canAccess = event.checked));
    }

    const updateParent = (node: any) => {
      if (
        node &&
        (!event.checked ||
          !node.children.find((c: any) => c.data.canAccess != event.checked))
      ) {
        node.data.canAccess = event.checked;
        if (node.parent) {
          updateParent(node.parent);
        } else {
          return;
        }
      }
      return;
    };
    updateParent(data.parent);

    if (data) {
      if (
        (event.checked &&
          !espaces.find((e: any) => e.data.canAccess != event.checked)) ||
        (!event.checked &&
          espaces.find((e: any) => e.data.canAccess != event.checked))
      ) {
        canAccess = event.checked;
      }
    }
    return canAccess;
  }
  onNodeExpand(espaces: any[], event: any) {
    for (let e of espaces) {
      if (e.data.espace === event.node.data.espace) {
      } else if (e.expanded && e.children?.length) {
        if (
          this.helpers
            .flatDeep(e.children, "children")
            .find((c: any) => c.data.espace === event.node.data.espace)
        ) {
          this.helpers
            .flatDeep(e.children, "children")
            .filter((c: any) => c.data.espace != event.node.data.espace)
            .map((c: any) => delete c.expanded);
        } else {
          delete e.expanded;
          this.helpers
            .flatDeep(e.children, "children")
            .map((c: any) => delete c.expanded);
        }
      }
    }
  }
  //#endregion

}
