import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DropzoneConfigInterface, DROPZONE_CONFIG } from "ngx-dropzone-wrapper";
import { ToastrModule } from "ngx-toastr";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef
} from "primeng/dynamicdialog";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: "https://httpbin.org/post",
  maxFilesize: 50
};
const listModule  :any=[

]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) =>
          new TranslateHttpLoader(http, "./assets/i18n/", ".json"),
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
    ...listModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    },
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
