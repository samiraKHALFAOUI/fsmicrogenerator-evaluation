import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { GroupService } from "src/app/shared/services/AccountManagement/group.service";
import { Group } from "src/app/shared/models/AccountManagement/Group.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.scss"],
})
export class AddGroupComponent {
  optionsEtatUtilisation: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Group | undefined;
  @Input() mode: 'clone' | 'add/edit' | 'detail' = 'add/edit';
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = '';
  selectedTab = 0;
  prevTabIcon = 'pi pi-chevron-left';
  nextTabIcon = 'pi pi-chevron-right';

  espaces: any[] = [];
  checked = false;
  checked2 = false;
  canAccess = false;
  espaceError = { showErrorDialog: false, errorDialogText: 'code_11179' };


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private groupService: GroupService,
    private secureStorage: SecureStorageService,
  ) {
    this.optionsEtatUtilisation = this.groupService.etatUtilisation;
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idGroup")
    ) {
      this.id = this.config.data.idGroup;
      this.independentComponent = false;
      if (this.id) {
        this.getGroup();
      } else {
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      etatUtilisation: ['code_4316', [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        designation: [null, [Validators.required]],
      }),
      espaces: [[], [Validators.required]],
      users: [[], []],
    });

    this.activatedRoute.params.subscribe({
      next: (params: any) => {
        if (params.id) {
          this.id = params.id;
          this.getGroup();
        }
      },
    });

    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response['service'] === 'group';
          if (this.independentComponent) {
            if (response['dataR']['data']) {
              this.patchValueIntoForm(response['dataR']['data']);
              this.id = response['dataR']['data']._id;
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params['id'];
                  if (this.id) this.getGroup();
                },
                error: () => {
                  this.messagesService.showMessage('error');
                },
              });
          }
        },
        error: () => {
          this.messagesService.showMessage('error');
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getGroup();
      } else if (!Object.keys(this.config?.data || []).includes('idGroup')) {
      }
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
      this.getGroup();
    }
  }
  ngDoCheck(): void {
    const global_espace = this.secureStorage.getItem('global_espace', true)
    if (!this.checked && global_espace) {
      this.checked = true;
      let result = this.groupService.checkEspace();
      this.canAccess = result.canAccess;
      this.espaces = result.espaces;
    }

    if (
      !this.checked2 &&
      this.form.get('espaces')?.value.length &&
      this.espaces.length
    ) {
      this.checked2 = true;
      this.canAccess = this.groupService.patchEspace(
        this.espaces,
        this.form.get('espaces')?.value
      );
    }
  }

  handleChange(event: any, data: any) {
    this.canAccess = this.groupService.handleChange(
      this.espaces,
      this.canAccess,
      event,
      data
    );
  }
  onNodeExpand(event: any) {
    this.groupService.onNodeExpand(this.espaces, event);
  }

  getGroup() {
    let getData = () => {
      return this.helpers.resolve<Group>((res, rej) => {
        this.groupService
          .getGroupById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error('error', error);
              rej(error);
            },
          });
      });
    };

    Promise.all([getData()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error('error', error);
        this.messagesService.showMessage('error');
      });
  }

  patchValueIntoForm(data: Group) {
    let result = <Partial<Group>>this.helpers.newObject(data);
    this.form.patchValue(result);
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  addData() {
    this.form.get('espaces')?.setValue(
      this.helpers
        .flatDeep(this.espaces, 'children')
        .filter((e: any) => e.data.canAccess)
        .map((e: any) => e.data)
    );



    if (!this.form.get('espaces')?.value.length) {
      this.espaceError.showErrorDialog = true;
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage('error', 'invalid form');

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === 'INVALID')
          invalidControls.push(key);
      }


      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, ['users']);

      if (this.id) {
        this.groupService
          .updateGroup(this.id, newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              let currentUser = this.secureStorage.getItem('user', true)
              if (Object.keys(currentUser).length && this.id === currentUser.groupe._id) {
                currentUser.groupe = this.current
                this.secureStorage.setItem('user', currentUser, true)
              }
              this.messagesService.showMessage('updateSuccess');
            },
            error: () => {
              this.messagesService.showMessage('updateError');
            },
          });
      } else {
        this.groupService
          .addGroup(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage('addSuccess');
            },
            error: () => {
              this.messagesService.showMessage('addError');
            },
          });
      }
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        item: this.current,
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
