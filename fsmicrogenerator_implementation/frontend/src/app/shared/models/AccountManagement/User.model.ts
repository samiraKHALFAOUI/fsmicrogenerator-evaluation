import { Taxonomy } from "src/app/shared/models/TaxonomyManagement/Taxonomy.model";
import { Group } from "./Group.model";

export interface User {
  _id: string;
  reference: string;
  pseudo: string;
  email: string;
  pwCrypte: string;
  salutation: string;
  translations: { language: string; nom: string; prenom: string };
  fonction: Taxonomy;
  photo: string;
  telephone: string;
  fixe: string;
  nbreConnection: number;
  dateDerniereConnexion: Date | string;
  etatCompte: string;
  etatObjet: string;
  groupe: Group;
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
