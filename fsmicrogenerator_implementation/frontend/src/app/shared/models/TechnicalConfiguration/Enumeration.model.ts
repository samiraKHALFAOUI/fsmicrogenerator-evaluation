export interface Enumeration {
  _id: string;
  etatObjet: string;
  code: string;
  translations: { language: string; valeur: string; commentaire: string };
  etatValidation: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
