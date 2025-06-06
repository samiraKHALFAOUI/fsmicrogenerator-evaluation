import { Component } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from 'src/app/shared/services/AccountManagement/user.service';
import { User } from 'src/app/shared/models/AccountManagement/User.model';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: User | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: User | undefined;
  id: any = '';
  cloneMode: boolean = false;
  selectedTab = 0;
  prevTabIcon = 'pi pi-chevron-left';
  nextTabIcon = 'pi pi-chevron-right';

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private compteUserService: UserService,
    private secureStorage: SecureStorageService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes('idCompteUser')
    ) {
      this.id = this.config.data.idCompteUser;
      this.independentComponent = false;
      if (this.id) {
        this.getCompteUser();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getCompteUser();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response['service'] === 'compteUser';
          if (this.independentComponent)
            this.transformData(response['dataR']['data']);
        },
      });
    }

    if (this.secureStorage.getItem('lang') === 'ar') {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes('ToOne') &&
      changes['current'] &&
      changes['current'].currentValue
    ) {
      //@ts-ignore
      this.id = this.current?._id || this.current;
      this.getCompteUser();
    }
  }

  getCompteUser() {
    this.compteUserService
      .getUserById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: User) {

    this.data = result;
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  goBack() {
    if (!this.independentComponent) {
      if (this.config?.data) {
        this.refConfig.close({ data: this.config.data });
      } else this.onDetailFinish.emit();
    } else {
      this.location.back();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
