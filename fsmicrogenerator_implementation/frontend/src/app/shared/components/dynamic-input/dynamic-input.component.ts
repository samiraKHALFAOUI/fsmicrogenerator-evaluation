import { OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { HelpersService } from '../../services/defaultServices/helpers.service';
import { Dropdown } from 'primeng/dropdown';
import { ReplaySubject } from 'rxjs';
import { maxDateValidator, minDateValidator } from '../../validators/custom.validators';
import { flags } from "src/assets/flags/flag";
@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss']
})
export class DynamicInputComponent implements OnChanges {
  private destroyed$ = new ReplaySubject<boolean>();
  prevInputValue !: string
  @Input() typeInput !: 'code_1308' | 'icon' | 'code_1305' | 'code_2477' | 'code_2475' | 'code_2476' | 'code_1307' | "code_1319" | 'code_12356' | string
  @Input() natureInfo !: string
  @Input() valeurs!: any
  @Input() displayType: 'simple' | 'custom' = 'simple'
  @Input() valeurParDefaut !: string | number | Date | boolean
  @Input() valeurMin !: any//string | number | Date |boolean
  @Input() valeurMax !: any//string | number | Date |boolean
  @Input() control !: FormControl
  @Input() label !: string
  @Input() serviceName: string = ''
  @Input() isRange: boolean = false
  @Input() data: any
  @Input() mode: 'ecriture' | 'lecture' = 'ecriture'
  @Input()  selectionMode:string="";
  defaultDate: Date = new Date(0)
  rangeValue: number[] = [0, 1000]
  count = 1;
  intervalId: any = 0;
  timeId: any = 0;
  sliceCount = 50;
  iconOptions: any = [];
  iconsToDisplay: any = []
  showIcons: boolean = false
  filterIconLabel: any
  @ViewChild('iconsDropdown') iconsDropdown!: Dropdown;
  selectedIcon: any = null
  loading: boolean = false;
  checked: boolean = false;
  @Input() name !:string
  constructor(private helperService: HelpersService) {
    if(!this.name)
      this.name = this.helperService.generateReference(Math.random().toString(),Date.now())
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.typeInput === 'icon' && changes['control'] && changes['control'].currentValue && !changes['control'].previousValue) {
      this.onIconsDropdownPanelShow()
    }
    if ((changes['valeurMax'] && changes['valeurMax'].currentValue != changes['valeurMax'].previousValue)
    ) {
      this.onDateChange(null)
      this.prevValue.min = changes['valeurMax'].previousValue
    } else if (changes['valeurMin'] && changes['valeurMin'].currentValue != changes['valeurMin'].previousValue) {
      this.onDateChange(null)
      this.prevValue.max = changes['valeurMin'].previousValue
    }
  }
  ngDoCheck(): void {
    if (!this.checked && ['code_356', 'code_355'].includes(this.natureInfo) && /*(this.mode=='lecture' ? true : this.displayType === 'simple') &&*/ this.valeurs?.length && (this.mode === 'lecture' ? this.data : this.control?.value)) {
      let data: any = this.mode === 'lecture' ? this.data : this.control?.value
      let values: any
      if (this.natureInfo === 'code_356')
        values = this.valeurs.filter((v: any) => data.find((d: any) => d._id === v._id))
      else
        {
          if(data instanceof Array)
          data = data[0]
          values = this.valeurs.find((v: any) => data?._id === v?._id)}
      this.mode === 'lecture' ? this.data =values :  this.control.setValue(values)
      this.checked = true
    }
  }
  ngOnInit(): void {
    if (this.typeInput === 'icon' && this.mode === 'ecriture' && this.control.value) {
      this.onIconsDropdownPanelShow()
    }
  }
  prevValue: any = {}
  onDateChange(event: any) {
    if (event && this.control.value && this.typeInput === 'code_12356') {
      let value = this.control.value
      let defaultDate = new Date('1998-05-26').setHours(value.getHours(), value.getMinutes(), value.getSeconds())
      this.control.setValue(new Date(defaultDate))
      this.defaultDate = new Date(defaultDate)
    }
    if (this.control.value) {
      const selectedDate = new Date(this.control.value);
      if (selectedDate && this.valeurMin && selectedDate < this.valeurMin) {
        // Set min validator if selected date is less than valeurMin
        this.control.setValidators(minDateValidator(this.valeurMin, 'time'));
      } else if (selectedDate && this.valeurMax && selectedDate > this.valeurMax) {
        // Set max validator if selected date is greater than valeurMax
        this.control.setValidators(maxDateValidator(this.valeurMax, 'time'));
      } else {
        let currentValidators = this.control?.validator;
        this.control?.setValidators(currentValidators ? Validators.compose(
          Object.values(currentValidators).filter((validator: ValidatorFn) => ![Validators.min(this.prevValue.min), Validators.max(this.prevValue.max)].includes(validator))
        ) : null);
      }
    } else {
      // Remove validators if conditions are not met
      if(this.control.hasError('required'))
      this.control.setValidators(Validators.required)
   //   this.control.clearValidators();
    }
    this.control.updateValueAndValidity({ emitEvent: false });
  }
  onRangeChange(event: any) {
    this.rangeValue = event.values
  }
  updateRange() {
    this.control.setValue(this.rangeValue)
  }
  getIcons() {
    this.loading = true;
    this.iconOptions = [
      ...this.helperService.listIcons
    ];
    this.iconsToDisplay = [
      ...this.helperService.listIcons
    ];
    this.selectedIcon = this.control.value || null
    if (this.selectedIcon) {
      this.iconsToDisplay = [{ title: this.selectedIcon }, ...this.iconsToDisplay.filter((i: any) => i.title != this.selectedIcon)]
    }
    setTimeout(() => {
      this.filterIconLabel = ''
      this.showIcons = true
      this.loading = false
    }, 15);
  }
  getFlags(){
    this.loading = true;
    this.iconOptions = [
      ...flags
    ];
    this.iconsToDisplay = [
      ...flags
    ];
    this.selectedIcon = this.control.value || null
    if (this.selectedIcon) {
      this.iconsToDisplay = [this.iconsToDisplay.find((i:any)=>i.value === this.selectedIcon), ...this.iconsToDisplay.filter((i: any) => i.value != this.selectedIcon)]
    }
    setTimeout(() => {
      this.filterIconLabel = ''
      this.showIcons = true
      this.loading = false
    }, 15);
  }
  saveSelectedIcon() {
    this.control.setValue(this.selectedIcon)
    this.showIcons = false
  }
  onIconsDropdownPanelShow(event?: any) {
    if (this.control?.value) {
      let icon = this.helperService.listIcons.find(
        (icon: any) => icon.title === this.control?.value
      );
      this.iconOptions = [
        icon,
        ...this.helperService.listIcons.slice(0, this.sliceCount),
      ];
      this.timeId = setTimeout(() => {
        this.intervalId = setInterval(() => {
          if (
            this.helperService.listIcons
              .slice(0, this.sliceCount + (this.count += 50))
              .find(
                (icon: any) => icon.title === this.control?.value
              )
          ) {
            this.iconOptions = this.helperService.listIcons.slice(
              0,
              this.sliceCount + (this.count += 50)
            );
          } else {
            this.iconOptions = [
              icon,
              ...this.helperService.listIcons.slice(
                0,
                this.sliceCount + (this.count += 50)
              ),
            ];
          }
          if (this.iconOptions.length === this.helperService.listIcons.length) {
            this.count = 0;
            clearInterval(this.intervalId);
          }
        }, 500);
      }, 500);
    } else {
      this.iconOptions = this.helperService.listIcons.slice(0, this.sliceCount);
      this.timeId = setTimeout(() => {
        this.intervalId = setInterval(() => {
          this.iconOptions = this.helperService.listIcons.slice(
            0,
            this.sliceCount + (this.count += 50)
          );
          if (this.iconOptions.length === this.helperService.listIcons.length) {
            this.count = 0;
            clearInterval(this.intervalId);
          }
        }, 500);
      }, 500);
    }
  }
  onIconsDropdownPanelHide() {
    let value = this.control?.value;
    let index = this.helperService.listIcons.findIndex(
      (icon: any) => icon.title === value
    );
    this.count = 0;
    clearTimeout(this.timeId);
    clearInterval(this.intervalId);
    this.iconOptions =
      index >= Math.floor(this.sliceCount)
        ? this.helperService.listIcons.slice(
          index - Math.floor(this.sliceCount / 2),
          index + Math.floor(this.sliceCount / 2)
        )
        : this.helperService.listIcons.slice(0, this.sliceCount);
  }
  onIconsDropdownChange(event: any) {
    clearTimeout(this.timeId);
    clearInterval(this.intervalId);
    let value = event.value;
    if (value) {
      let index = this.helperService.listIcons.findIndex(
        (icon: any) => icon.title === value
      );
      this.iconOptions =
        index >= Math.floor(this.sliceCount)
          ? this.helperService.listIcons.slice(
            index - Math.floor(this.sliceCount / 2),
            index + Math.floor(this.sliceCount / 2)
          )
          : this.helperService.listIcons.slice(0, this.sliceCount);
    } else {
      this.iconOptions = this.helperService.listIcons.slice(0, this.sliceCount);
    }
  }
  onIconsDropdownFilter(event: any) {
    clearTimeout(this.timeId);
    clearInterval(this.intervalId);
    if (event.filter) {
      //  optionsToDisplay
      this.iconsDropdown.options = this.helperService.listIcons
        .filter((icon: any) => icon.title.includes(event.filter))
        .slice(0, this.sliceCount);
    } else {
      let value = this.control?.value;
      if (value) {
        let index = this.helperService.listIcons.findIndex(
          (icon: any) => icon.title === value
        );
        this.iconOptions =
          index >= Math.floor(this.sliceCount)
            ? this.helperService.listIcons.slice(
              index - Math.floor(this.sliceCount / 2),
              index + Math.floor(this.sliceCount / 2)
            )
            : this.helperService.listIcons.slice(0, this.sliceCount);
      } else {
        this.iconsDropdown.options =
          this.helperService.listIcons.slice(0, this.sliceCount);
      }
    }
  }
  onFilterChange(event: any) {
    this.iconsToDisplay = this.helperService.newObject(this.iconOptions.filter((i: any) => (i.title|| i.label )?.toLowerCase().includes(this.filterIconLabel?.toLowerCase())|| (i.value?.toLowerCase()?.includes(this.filterIconLabel?.toLowerCase())) ))
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
