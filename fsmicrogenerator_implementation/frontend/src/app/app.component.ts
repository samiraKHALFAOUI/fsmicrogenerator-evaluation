import { Component } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ReplaySubject } from "rxjs";
import { DialogService } from 'primeng/dynamicdialog';
import { SecureStorageService } from "./shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  title = "code-0";
  loading: boolean = true;

  constructor(private router: Router,
    private translateService: TranslateService,
    private dialogService: DialogService,
    private secureStorage: SecureStorageService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
          dialog.destroy();
        });
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }
  ngOnInit(): void {
    if (!this.translateService.currentLang) {
      this.translateService.use(
        this.secureStorage.getItem('lang') ||
        this.secureStorage.getItem('defLang') ||
        'fr')
    }

  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
