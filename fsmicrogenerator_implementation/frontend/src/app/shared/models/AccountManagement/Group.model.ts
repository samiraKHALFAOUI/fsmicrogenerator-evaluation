import { User } from "./User.model";

export interface Group {
  _id: string;
  etatObjet: string;
  etatUtilisation: string;
  translations: { language: string; designation: string };
  espaces: any[];
  users: User[];
  createdAt: Date | string;
  updatedAt: Date | string;
  [key: string]: any;
}
