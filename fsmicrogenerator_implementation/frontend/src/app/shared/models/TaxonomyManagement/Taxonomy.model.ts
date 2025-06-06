import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";

export interface Taxonomy {
  _id: string;
  etatObjet: string;
  logo: string;
  translations: { language: string; designation: string; description: string };
  domain: Domain;
  parent: Taxonomy;
  children: Taxonomy[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
