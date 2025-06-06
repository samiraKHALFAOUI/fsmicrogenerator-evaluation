import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TransactionLineService } from "src/app/shared/services/TransactionManagement/transactionLine.service";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";

@Component({
  selector: "app-detail-transaction-line",
  templateUrl: "./detail-transaction-line.component.html",
  styleUrls: ["./detail-transaction-line.component.scss"],
})
export class DetailTransactionLineComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: TransactionLine | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: TransactionLine | undefined;
  id: any = "";
  cloneMode: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private transactionLineService: TransactionLineService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idTransactionLine")
    ) {
      this.id = this.config.data.idTransactionLine;
      this.independentComponent = false;
      if (this.id) {
        this.getTransactionLine();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getTransactionLine();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "transactionLine";
          if (this.independentComponent)
            this.transformData(response["dataR"]["data"]);
        },
      });
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
      this.getTransactionLine();
    }
  }

  getTransactionLine() {
    this.transactionLineService
      .getTransactionLineById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: () => {},
      });
  }

  transformData(result: TransactionLine) {
    this.data = result;
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
