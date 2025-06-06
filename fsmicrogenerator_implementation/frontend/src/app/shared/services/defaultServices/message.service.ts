import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";

declare type Operation =
  | "addSuccess"
  | "addError"
  | "updateSuccess"
  | "updateError"
  | "deleteSuccess"
  | "deleteError"
  | "ordreSuccess"
  | "ordreError"
  | "success"
  | "error"
  | "warn"
  | "info"
  | "cloneSuccess"
  | "cloneError"
  | "validationSuccess"
  | "validationError"
  | "uploadSuccess"
  | "restoreSuccess"
  | "uploadError";

@Injectable({
  providedIn: "root"
})
export class MessagesService {
  etatDeCreationOptions = [
    "etatCreation.creation",
    "etatCreation.adaptation",
    "etatCreation.testEnCours",
    "etatCreation.testAttente",
    "etatCreation.validation",
    "etatCreation.valider",
    "etatCreation.terminer",
    "etatCreation.cloturer",
    "etatCreation.correctionEnCours",
    "etatCreation.corriger"
  ];
  etatObjetOptions = ["code-1", "code-2"];
  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) { }
  showMessage(operation: Operation, customMessage?: string, summary?: string, detail?: string) {
    let message = {
      severity: "",
      summary: "",
      detail: ""
    };
    this.translateService
      .get(customMessage || `toast.${operation}`)
      .subscribe((data: any) => {
        message.detail = data;
        if (detail)
          message.detail += ` :${detail}`
      });
    this.translateService
      .get(summary || `toast.${operation}`)
      .subscribe((data: any) => {
        message.summary = data;
      });
    switch (operation) {
      case "restoreSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;
      case "addSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;
      case "addError":
        message.severity = "error";
        //message.summary = summary || "Error";
        break;
      case "cloneSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;
      case "cloneError":
        message.severity = "error";
        //message.summary = summary || "Error";
        break;
      case "uploadSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;
      case "uploadError":
        message.severity = "error";
        //message.summary = summary || "Error";
        break;

      case "updateSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;

      case "updateError":
        message.severity = "error";
        //message.summary = summary || "Error";
        break;

      case "deleteSuccess":
        message.severity = "success";
        //message.summary = summary || "Success";
        break;

      case "deleteError":
        message.severity = "error";
        //message.summary = summary || "Error";
        break;

      case "validationSuccess":
        message.severity = "success";
        //message.summary = summary || customMessage || "success";
        break;

      case "validationError":
        message.severity = "error";
        //message.summary = summary || customMessage || "error";
        break;

      case "success":
        message.severity = "success";
        //message.summary = summary || customMessage || "success";
        break;

      case "error":
        message.severity = "error";
        //message.summary = summary || customMessage || "error";
        break;

      case "warn":
        message.severity = "warn";
        //message.summary = summary || customMessage || "warn";
        break;

      case "info":
        message.severity = "info";
        //message.summary = summary || customMessage || "info";
        break;

      default:
        break;
    }

    this.messageService.add(message);
  }
}
