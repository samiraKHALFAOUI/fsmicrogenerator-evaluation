export interface LangueSite {
  _id: string;
  etatObjet: string;
  code: string;
  translations: { language: string; value: string; commentaire: string };
  flag: string;
  actif: boolean;
  ordreAffichage: number;
  langueParDefault: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
