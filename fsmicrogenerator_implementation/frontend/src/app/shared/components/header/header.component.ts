import { HelpersService } from '../../services/defaultServices/helpers.service';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import screenfull from 'screenfull';
import { AuthService } from 'src/app/shared/services/defaultServices/auth.service';
import { LangueSiteService } from '../../services/TechnicalConfiguration/langueSite.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { LangueSite } from '../../models/TechnicalConfiguration/LangueSite.model';
import { TranslateService } from '@ngx-translate/core';
import { SecureStorageService } from '../../services/defaultServices/secureStorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  @Input() showSidebar = true;
  @Output() showSidebarChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  showUserMenu = false;
  mobileSize = false;
  fullScreen = screenfull;
  user: any;
  isLangListOpened = false;
  notifications: any[] = [];
  langFlag: any;
  langs: LangueSite[] = [];

  constructor(private authService: AuthService,
    private router: Router,
    private langueSiteService: LangueSiteService,
    private helpers: HelpersService,
    private translateService: TranslateService,
    private secureStorage: SecureStorageService,
  ) { }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    this.showSidebarChange.emit(this.showSidebar);
  }

  changeLang(code: string) {
    this.langContainer.nativeElement.classList.remove('open');
    this.secureStorage.setItem('lang', code, false)
    this.secureStorage.removeItem('menu');
    this.secureStorage.removeItem('global_espace');
    this.translateService.use(code)
    window.location.reload();
  }

  @ViewChild('lang') langContainer: any;
  @ViewChild('st') sidebarToggler: any;
  @ViewChild('umt') userMenuToggler: any;
  @ViewChild('um') userMenu: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.handleSidebar();
  }

  @HostListener('window:click', ['$event'])
  onClick(event: any) {
    const recF = (parent: any, child?: any): boolean => {
      let element = child || event.srcElement;

      let includes = false;
      if (parent === element) {
        return true;
      } else if (parent?.children?.length) {
        for (let i = 0; i < parent.children.length; i++) {
          if (parent.children[i] === element) {
            includes = true;
          } else {
            includes = recF(parent.children[i], element);
          }
          if (includes === true) break;
        }
      }
      return includes;
    };

    let sidebar = document.querySelector('aside#sidebar.sidebar');

    if (
      !(
        recF(event.srcElement, this.langContainer?.nativeElement) ||
        recF(this.userMenuToggler?.nativeElement)
      )
    )
      this.langContainer.nativeElement.classList.remove('open');

    if (
      this.showUserMenu &&
      this.mobileSize &&
      !(
        recF(this.userMenu?.nativeElement) ||
        recF(this.userMenuToggler?.nativeElement)
      )
    )
      this.showUserMenu = false;

    if (
      this.showSidebar &&
      this.mobileSize &&
      !event.srcElement.classList.value
        .split(' ')
        .includes('left-sidebar-toggler') &&
      !event.srcElement.classList.value
        .split(' ')
        .includes('left-sidebar-toggler-icon') &&
      !recF(sidebar, event.target)
    ) {
      this.showSidebar = false;
      this.showSidebarChange.emit(false);
    }
  }

  logOut() {
    this.authService.logOut();
  }

  handleSidebar() {
    if (window.innerWidth < 1170) {
      this.mobileSize = true;
      this.showSidebar = false;
      this.showSidebarChange.emit(this.showSidebar);
    } else {
      this.mobileSize = false;
      this.showSidebar = true;
      this.showSidebarChange.emit(this.showSidebar);
    }
  }

  ngOnInit(): void {
    this.user = this.secureStorage.getItem('user',true) || {};

    Promise.all([this.getLangueSite()]).then((result) => {
      if (this.langs && this.langs.length) {
        const language = this.secureStorage.getItem('lang')
        if (language)
          this.langFlag = this.langs.find((lang) => lang.code === language)?.flag;

        if (!this.langFlag)
          this.langFlag = this.langs.find((lang) => lang.langueParDefault)?.flag;

        if (!this.langFlag)
          this.langFlag = this.langs.find((lang) => lang.code === 'fr')?.flag;

        if (!this.langFlag)
          this.langFlag = this.langs[0].flag;


      }
      setTimeout(() => {
        this.handleSidebar();
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            if (this.mobileSize) {
              this.showSidebar = false;
              this.showSidebarChange.emit(this.showSidebar);
            }
          }
        });
      }, 0.1);
    })


  }

  getLangueSite() {
    return this.helpers.resolve((res, rej) => {
      this.langueSiteService.getLangueSites({ condition: { actif: true }, options: { queryOptions: { sort: { ordreAffichage: 1 } } } }).pipe(takeUntil(this.destroyed$)).subscribe({
        next: (result) => {
          this.langs = result
          if (!this.langueSiteService.languages.length) {
            this.langueSiteService.languages = result
          } else {

          }
          res(this.langs)

        }, error: (error) => {
          rej(error)
        }
      })
    })

  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
