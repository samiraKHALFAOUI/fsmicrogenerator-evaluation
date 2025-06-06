import { Taxonomy } from "./Taxonomy.model";

export interface Domain {
  _id: string;
  etatObjet: string;
  code: string;
  logo: string;
  translations: { language: string; designation: string; description: string };
  hasTaxonomies: boolean;
  parent: Domain;
  children: Domain[];
  taxonomies: Taxonomy[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
