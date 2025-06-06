export interface Menu {
  _id: string;
  etatDePublication: string;
  etatObjet: string;
  translations: { language: string; titre: string };
  planPrincipale: string;
  megaMenu: string;
  icon: string;
  ordre: number;
  priorite: number;
  path: string;
  typeAffichage: string;
  typeActivation: string;
  periodeActivation: { dateDebut: Date | string; dateFin: Date | string }[];
  periodiciteActivation: any;
  elementAffiche: string[];
  menuParent: Menu;
  menuAssocies: Menu[];
  menuPrincipal: boolean;
  actif: boolean;
  type: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
