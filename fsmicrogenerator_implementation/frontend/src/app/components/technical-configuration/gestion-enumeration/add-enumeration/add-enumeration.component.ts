import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { EnumerationService } from "src/app/shared/services/TechnicalConfiguration/enumeration.service";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";

@Component({
  selector: "app-add-enumeration",
  templateUrl: "./add-enumeration.component.html",
  styleUrls: ["./add-enumeration.component.scss"],
})
export class AddEnumerationComponent {
  optionsEtatValidation: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Enumeration | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private enumerationService: EnumerationService
  ) {
    this.optionsEtatValidation = this.enumerationService.etatValidation;
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idEnumeration")
    ) {
      this.id = this.config.data.idEnumeration;
      this.independentComponent = false;
      if (this.id) {
        this.getEnumeration();
      } else {
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        valeur: [null, [Validators.required]],
        commentaire: [null, []],
      }),
      etatValidation: [null, [Validators.required]],
    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "enumeration";
          if (this.independentComponent) {
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params["id"];
                  if (this.id) this.getEnumeration();
                },
                error: (error) => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: (error) => {
          this.messagesService.showMessage("error");
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getEnumeration();
      } else if (
        !Object.keys(this.config?.data || []).includes("idEnumeration")
      ) {
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getEnumeration();
    } else if (
      this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue &&
      changes["current"].previousValue
    ) {
      this.patchValueIntoForm(changes["current"].currentValue);
    }
  }

  getEnumeration() {
    let getData = () => {
      return this.helpers.resolve<Enumeration>((res, rej) => {
        this.enumerationService
          .getEnumerationById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error("error", error);
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
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: Enumeration) {
    let result = <Partial<Enumeration>>this.helpers.newObject(data);

    this.form.patchValue(result);
    this.form.get('code')?.disable()
  }

  addData() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage("error", "invalid form");

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === "INVALID")
          invalidControls.push(key);
      }

      console.error("invalid controls -->", invalidControls);

      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());

      if (this.id) {
        this.enumerationService
          .updateEnumeration(this.id, newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage("updateSuccess");
            },
            error: (error: any) => {
              this.messagesService.showMessage("updateError");
            },
          });
      } else {
        this.enumerationService
          .addEnumeration(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: (error: any) => {
              this.messagesService.showMessage("addError");
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
