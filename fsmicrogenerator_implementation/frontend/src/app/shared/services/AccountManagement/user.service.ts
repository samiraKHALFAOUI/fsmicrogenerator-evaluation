import { Injectable } from "@angular/core";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { APIService } from "src/app/shared/services/defaultServices/api.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  userUrl = `/accountManagementService/users`;
  salutation: any = ["code_1232", "code_1233"];
  etatCompte: any = ["code_10577", "code_4316", "code_4317", "code_226"];
  constructor(private apiService: APIService, private helpers: HelpersService) {
    //translate i18n values for dropdown options
    Promise.all(
      [
        this.helpers.translateValues(this.salutation),
        this.helpers.translateValues(this.etatCompte),
      ]
    )
      .then((result) => {
        this.salutation = result[0];
        this.etatCompte = result[1];
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  getUsers(params?: { [key: string]: any }) {
    return this.apiService.get<User[]>(
      `${this.userUrl}?params=${JSON.stringify(params || {})}`
    );
  }

  getUserById(id: string, params?: { [key: string]: any }) {
    return this.apiService.get<User>(
      `${this.userUrl}/${id}?params=${JSON.stringify(params || {})}`
    );
  }

  getOneUser(params?: { [key: string]: any }) {
    return this.apiService.get<User>(
      `${this.userUrl}/one?params=${JSON.stringify(params || {})}`
    );
  }

  getStatistiquesUser(configuration: any) {
    return this.apiService.post<any>(
      `${this.userUrl}/statistiques`,
      configuration
    );
  }

  addUser(user: any) {
    return this.apiService.post<User>(`${this.userUrl}`, user);
  }

  addManyUser(user: any) {
    return this.apiService.post<User[]>(`${this.userUrl}/many`, user);
  }

  getUserForTranslation(id: string) {
    return this.apiService.get<User>(`${this.userUrl}/translate/${id}`);
  }

  translateUser(id: string, user: any) {
    return this.apiService.patch<{ message: string; data: User }>(
      `${this.userUrl}/translate/${id}`,
      user
    );
  }

  updateUser(id: string, user: any) {
    return this.apiService.patch<{ message: string; data: User }>(
      `${this.userUrl}/${id}`,
      user
    );
  }

  updateManyUser(body: { ids: any[]; data: any }) {
    return this.apiService.patch<{ message: string }>(
      `${this.userUrl}/many`,
      body
    );
  }

  changeState(data: { id: string[]; etat: string }) {
    return this.apiService.patch<{ message: string }>(`${this.userUrl}/`, data);
  }
}
