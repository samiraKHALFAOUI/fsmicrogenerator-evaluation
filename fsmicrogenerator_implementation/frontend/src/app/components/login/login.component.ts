import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/defaultServices/auth.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { Router } from '@angular/router';
import { LangueSiteService } from 'src/app/shared/services/TechnicalConfiguration/langueSite.service';
import { TranslateService } from '@ngx-translate/core';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  loginForm!: FormGroup;
  passwordResetForm!: FormGroup;
  passwordResetCurrentIndex = 0;
  showErrorDialog = false;
  verificationKey = '';
  errorDialogText = '';
  loading = false;
  emailVerified = false;
  message = 'code_11505';
  passwordReset = false;

  @ViewChild('loadingModal') loadingModal: any;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private dialogService: DialogService,
    private helpers: HelpersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private langueSiteService: LangueSiteService,
    private translateService: TranslateService,
    private secureStorage: SecureStorageService,
  ) {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => {
      dialog.destroy();
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {

        if (params['backTo']) {
          this.router.navigateByUrl(params['backTo'])
        } {
          this.router.navigateByUrl('/**');
        }
      },
      error: (error: any) => {
        console.error(error);
      },
    });

    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      ancienMDP: [null, [Validators.required]],
      nouveauMDP: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,20}'
          ),
        ],
      ],

      pwConfirmation: [
        null,
        Validators.compose([
          Validators.required,
          (control: AbstractControl) => this.passwordMatch(control),
        ]),
      ],
      dateHeureDebutDemande: [new Date(), [Validators.required]],
      dateHeureFinDemande: [null, []],
      interruptionSystem: [null, []],
      refCompte: [null, []],
      etatDemande: ['code_6133', [Validators.required]],
      refNotification: [null, []],
    });
  }

  login() {
    if (this.loginForm.valid) {
      Promise.all([this.authService.login(this.loginForm.value)]).then((result) => {

        this.langueSiteService.getOneLangueSite({ condition: { langueParDefault: true } }).pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result: any) => {
              let lang = result?.code || 'fr'
              !this.secureStorage.getItem('lang') && this.secureStorage.setItem('lang', lang);
              this.secureStorage.setItem('defLang', lang);
              this.translateService.use(lang)


              const { backTo } = this.router.parseUrl(this.router.url).queryParams;

              backTo
                ? this.router.navigateByUrl(backTo)
                : this.router.navigateByUrl('/dashboard');
            },
            error: (error: any) => {
              console.error(error)
            },
          });
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  resetPassword(show: boolean = false) {
    if (!show) {
      this.emailVerified = false;
      this.passwordReset = true;
    } else {
      document
        .querySelector('.email-verification-message-container')
        ?.classList.remove('hide');
    }
    document.querySelector('.login-form')?.classList.add('hide');
    document.querySelector('.login-form')?.classList.remove('show');
    document.querySelector('.password-reset-form')?.classList.remove('hide');
    document.querySelector('.password-reset-form')?.classList.add('show');
  }

  nextStep() {
    this.emailVerified = false;
    if (this.passwordResetForm.get('email')?.valid) {
      this.loading = true;
      this.loadingModal.nativeElement.style.width = '100vw';
      this.loadingModal.nativeElement.style.height = '100vh';

      this.authService
        .sendVerificationEmail({
          condition: { email: this.passwordResetForm.controls['email'].value },
          options: {
            projection: {
              etatCompte: 1,
              blackList: 1,
            },
          },
        })
        .subscribe({
          next: (result: any) => {
            this.loading = false;
            this.loadingModal.nativeElement.style.width = '0vw';
            this.loadingModal.nativeElement.style.height = '0vh';
            document
              .querySelector('.email-verification-container')
              ?.classList.add('hide');
            if (
              !result ||
              result.blackList ||
              result.etatCompte != 'code_4316'
            ) {
              this.message = 'code_11505';
              document
                .querySelector('.email-verification-message-container')
                ?.classList.remove('hide');
            } else {
              this.emailVerified = true;
              this.passwordResetForm.get('refCompte')?.setValue(result._id);
            }
          },
          error: (err: any) => { },
        });
    } else {
      this.passwordResetForm.markAllAsTouched();
    }
  }
  passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
    return this.passwordResetForm?.get('nouveauMDP')?.value === control.value
      ? null
      : { mismatch: true };
  }
  changePassword() {
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
    } else {
      this.passwordResetForm.get('dateHeureDebutDemande')?.setValue(new Date());
      this.emailVerified = false;

      let newForm = this.helpers.newObject(this.passwordResetForm?.value);
      delete newForm.pwConfirmation;
      document
        .querySelector('.email-verification-message-container')
        ?.classList.remove('hide');
      this.authService
        .resetPassword(newForm)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.emailVerified = false;

            this.message = 'code_11568';
          },
          error: (error: any) => {
            this.emailVerified = false;
            this.message = error.error.message;

            console.error(error);
          },
        });
    }
  }
  returnToLogin() {
    document.querySelector('.login-form')?.classList.remove('hide');
    document.querySelector('.login-form')?.classList.add('show');
    document.querySelector('.password-reset-form')?.classList.add('hide');
    document.querySelector('.password-reset-form')?.classList.remove('show');

    setTimeout(() => {
      document
        .querySelector('.email-verification-container')
        ?.classList.remove('hide');

      document
        .querySelector('.email-verification-message-container')
        ?.classList.add('hide');

      /*  this.passwordResetForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      });*/
    }, 500);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
