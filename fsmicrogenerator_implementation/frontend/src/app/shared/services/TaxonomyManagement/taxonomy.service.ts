import { Injectable } from "@angular/core";
import { TreeNode } from "primeng/api";
import { Taxonomy } from "src/app/shared/models/TaxonomyManagement/Taxonomy.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";

@Injectable({
  providedIn: "root",
})
export class TaxonomyService {
  taxonomiesUrl = `/taxonomyManagementService/taxonomies`;

  constructor(private apiService: APIService) {
  }

  getTaxonomies(params?: { [key: string]: any }) {
    return this.apiService.get<Taxonomy[]>(
      `${this.taxonomiesUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getTaxonomyById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<Taxonomy>(
      `${this.taxonomiesUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneTaxonomy(params?: { [key: string]: any }) {
    return this.apiService.get<Taxonomy>(
      `${this.taxonomiesUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesTaxonomies(configuration: any) {
    return this.apiService.post<any>(
      `${this.taxonomiesUrl}/statistiques`,
      configuration
    );
  }

  addTaxonomy(taxonomies: any) {
    return this.apiService.post<Taxonomy>(
      `${this.taxonomiesUrl}`,
      taxonomies
    );
  }

  addManyTaxonomies(taxonomies: any) {
    return this.apiService.post<Taxonomy[]>(
      `${this.taxonomiesUrl}/many`,
      taxonomies
    );
  }

  getTaxonomiesForTranslation(id: string) {
    return this.apiService.get<Taxonomy>(
      `${this.taxonomiesUrl}/translate/${id}`
    );
  }

  translateTaxonomies(id: string, taxonomies: any) {
    return this.apiService.patch<{ message: string; data: Taxonomy }>(
      `${this.taxonomiesUrl}/translate/${id}`,
      taxonomies
    );
  }

  updateTaxonomies(id: string, taxonomies: any) {
    return this.apiService.patch<{ message: string; data: Taxonomy }>(
      `${this.taxonomiesUrl}/${id}`,
      taxonomies
    );
  }

  updateManyTaxonomies(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.taxonomiesUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(
      `${this.taxonomiesUrl}/`,
      data
    );
  }

    //#region taxonomie tree component
    taxonomiesToTreeNodesForSelection(
      domain: any,
      taxonomieType: "single" | "multiple",
      addAjouterButton: boolean = true
    ) {
      let taxonomiesNodes = [];
      if (domain?.taxonomies) {
        for (let taxo of domain.taxonomies) {
          taxonomiesNodes.push(
            this.taxonomieToTreeNodeForSelection(
              taxo,
              taxonomieType,
              domain.children,
              addAjouterButton
            )
          );
        }
      }

      if (domain && addAjouterButton)
        taxonomiesNodes.push({
          label: "ajouter",
          code: domain.code,
          data: domain,
          key: `ajouter-${domain._id}`,
          icon: "pi pi-plus",
          // @ts-ignore
          children: [],
        });

      return taxonomiesNodes;
    }

    taxonomieToTreeNodeForSelection(
      taxo: Taxonomy,
      taxonomieType: "single" | "multiple",
      domain: any = [],
      addAjouterButton: boolean = true
    ): TreeNode {
      let taxonomieTreeNodes: TreeNode[] = [];

      if (taxo.children?.length) {
        for (let t of taxo.children) {
          let domainChild = domain.find((d: any) => d._id === t.domain);
          if (domainChild) domainChild = domainChild.children;
          else domainChild = [];
          taxonomieTreeNodes.push(
            this.taxonomieToTreeNodeForSelection(
              t,
              taxonomieType,
              domainChild,
              addAjouterButton
            )
          );
        }
      }

      if (domain.length && addAjouterButton)
        taxonomieTreeNodes.push({
          label: "ajouter",
          data: taxo,
          key: `ajouter-${taxo._id}`,
          icon: "pi pi-plus",
          // @ts-ignore
          children: [],
        });
      // @ts-ignore
      let taxonomiesNode: any = {
        label: taxo.translations?.designation,
        data: taxo,
        key: taxo._id,
        icon: taxo.logo || " ",
        children: taxonomieTreeNodes,
      };

      if (taxonomieType === "multiple") delete taxonomiesNode.children;
      return taxonomiesNode;
    }
    //#endregion taxonomie tree component

    //#region taxonomie component
    // @ts-ignore
    transformDomain(domain: any, parents: any = [], domains: any = null) {
      if (domain.children.length && !domain.taxonomies.length) {
        return {
          key: domain._id,
          parents,
          data: domain,
          label: domain.translations.designation,
          selectable: false,
          children: domain.children.map((child: any) =>
            this.transformDomain(child, [
              ...parents,
              { type: "domain", code: domain.code, _id: domain._id },
            ])
          ),
        };
      } else if (
        (domain.children.length && domain.taxonomies.length) ||
        (!domain.children.length && domain.taxonomies.length)
      ) {
        let taxonomies = domain.taxonomies;
        if (domains)
          taxonomies = domain.taxonomies.filter(
            (taxonomie: any) => taxonomie.parent === domains._id
          );

        let obj = {
          key: domain._id,
          parents,
          data: domain,
          label: domain.translations.designation,
          selectable: false,
          children: taxonomies.map((taxonomie: any) =>
            this.transformTaxonomie(
              taxonomie,
              domain,
              taxonomie.children.length,
              [...parents, { type: "domain", code: domain.code, _id: domain._id }]
            )
          ),
        };
        // domain.taxonomies = [];
        return obj;
      } else if (!domain.children.length && !domain.taxonomies.length) {
        return {
          key: domain._id,
          parents,
          data: domain,
          label: domain.translations.designation,
          selectable: false,
          children: [],
        };
      }
    }
    transformTaxonomie(
      taxonomie: any,
      domain: any,
      taxonomieLength: number,
      parents: any = []
    ) {
      return {
        key: taxonomie._id,
        parents,
        data: taxonomie,
        label: taxonomie.translations.designation,
        children: taxonomieLength
          ? domain?.children.map((child: any) =>
            this.transformDomain(child, parents, taxonomie)
          )
          : domain?.children.map((child: any) => {
            let obj = {
              key: child._id,
              data: { ...child, taxonomies: [] },
              children: [],
            };
            return obj;
          }),
      };
    }
    //#endregion taxonomie component

    //#region tree select

    taxonomiesToTreeNodesForForm(domain: any) {
      let taxonomiesNodes = [];
      if (domain?.taxonomies) {
        for (let taxo of domain.taxonomies) {
          taxonomiesNodes.push(this.taxonomieToTreeNodeForForm(taxo));
        }
      }
      return taxonomiesNodes;
    }

    taxonomieToTreeNodeForForm(taxo: Taxonomy): TreeNode {
      let taxonomieTreeNodes: TreeNode[] = [];

      if (taxo.children.length) {
        for (let t of taxo.children) {
          taxonomieTreeNodes.push(this.taxonomieToTreeNodeForForm(t));
        }
      }

      let taxonomiesNode: any = {
        label: taxo.translations?.designation,
        data: taxo,
        key: taxo._id,
        icon: taxo.logo || " ",
        optionDisabled: taxo.children.length ? true : false,
        children: taxonomieTreeNodes,
      };

      return taxonomiesNode;
    }

    //#endregion tree select

}
