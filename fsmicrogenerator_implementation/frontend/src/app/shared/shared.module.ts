import { NgModule } from '@angular/core';
import { MessagesModule } from 'primeng/messages';

import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPayPalModule } from 'ngx-paypal';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
import { MeterGroupModule } from 'primeng/metergroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { DetailHoverButtonDirective } from './directives/detail-hover-button.directive';
import { HoverEffect3DDirective } from './directives/hover-effect-3d.directive';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DynamicChartsComponent } from './components/charts-components/dynamic-charts/dynamic-charts.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { SliderComponent } from './components/dynamic-input/slider/slider.component';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { LoadingComponent } from './components/loading/loading.component';
import { Page404Component } from './components/page404/page404.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SubBreadcrumbComponent } from './components/sub-breadcrumb/sub-breadcrumb.component';
import { TaxonomyInputComponent } from './components/taxonomy-input/taxonomy-input.component';
import { TaxonomyTreeComponent } from './components/taxonomy-tree/taxonomy-tree.component';
import { UndoDeleteDialogComponent } from './components/undo-delete-dialog/undo-delete-dialog.component';

import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { ChartTableComponent } from './components/charts-components/chart-table/chart-table.component';
import { DynamicApexChartComponent } from './components/charts-components/dynamic-apex-chart/dynamic-apex-chart.component';
import { MapChartComponent } from './components/charts-components/map-chart/map-chart.component';
import { PeriodeMenuConfigComponent } from './components/charts-components/periode-menu-config/periode-menu-config.component';
import { StatistiqueLoaderComponent } from './components/charts-components/statistique-loader/statistique-loader.component';
import { DataTypePipe } from './pipes/data-type.pipe';
import { DynamicTableCellColorPipeStyle } from './pipes/dynamic-table-cell-color-style.pipe';
import { DynamicTableCellColorPipe } from './pipes/dynamic-table-cell-color.pipe';
import { GenericPipe } from './pipes/generic.pipe';
import { PrettyPrintPipe } from './pipes/pretty-print.pipe';
import { ReadDataTablePipe } from './pipes/read-data-table.pipe';
import { CommingSoonComponent } from './components/comming-soon/comming-soon.component';

@NgModule({
  declarations: [
    HoverEffect3DDirective,
    DetailHoverButtonDirective,
    SidebarComponent,
    TaxonomyInputComponent,
    HeaderComponent,
    FooterComponent,
    ContentLayoutComponent,
    CommingSoonComponent,
    DynamicTableComponent,
    Page404Component,
    ReadDataTablePipe,
    PrettyPrintPipe,
    UndoDeleteDialogComponent,
    BreadcrumbComponent,
    SubBreadcrumbComponent,
    TaxonomyTreeComponent,
    GenericPipe,
    DataTypePipe,
    DynamicTableCellColorPipe,
    DynamicTableCellColorPipeStyle,
    DynamicInputComponent,
    SliderComponent,
    LoadingComponent,
    DynamicChartsComponent,
    DynamicApexChartComponent,
    PeriodeMenuConfigComponent,
    ChartTableComponent,
    MapChartComponent,
    StatistiqueLoaderComponent,

  ],
  imports: [
    CommonModule,
    MessagesModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DialogModule,
    DynamicDialogModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    InputTextModule,
    TagModule,
    MultiSelectModule,
    PasswordModule,
    AvatarModule,
    BadgeModule,
    DropzoneModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    InputNumberModule,
    DropdownModule,
    ToggleButtonModule,
    CheckboxModule,
    TabViewModule,
    InputTextareaModule,
    KeyFilterModule,
    CarouselModule,
    MeterGroupModule,
    RatingModule,
    CalendarModule,
    InputMaskModule,
    ChipsModule,
    ChipModule,
    AutoCompleteModule,
    TreeSelectModule,
    InputSwitchModule,
    RadioButtonModule,
    SliderModule,
    SelectButtonModule,
    SidebarModule,
    ToastModule,
    TooltipModule,
    StepsModule,
    PanelMenuModule,
    MenuModule,
    PanelModule,
    AccordionModule,
    OrderListModule,
    ToolbarModule,
    TreeTableModule,
    SpeedDialModule,
    FieldsetModule,
    DividerModule,
    OverlayPanelModule,
    CardModule,
    VirtualScrollerModule,
    ProgressBarModule,
    LazyLoadImageModule,
    NgbModule,
    NgApexchartsModule,
    TieredMenuModule,
    SplitterModule,
    ChartModule,
    HighchartsChartModule,
    EditorModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    NgxPaginationModule,
    NgxPayPalModule,
    SkeletonModule,
    DragDropModule,
    StepperModule,
    MenubarModule,
    MegaMenuModule,
    OrganizationChartModule,
  ],
  exports: [
    HoverEffect3DDirective,
    MessagesModule,
    DetailHoverButtonDirective,
    LoadingComponent,
    DynamicInputComponent,
    SidebarComponent,
    TaxonomyInputComponent,
    HeaderComponent,
    FooterComponent,
    CarouselModule,
    MeterGroupModule,
    ContentLayoutComponent,
    CommingSoonComponent,
    DynamicTableComponent,
    ReadDataTablePipe,
    PrettyPrintPipe,
    UndoDeleteDialogComponent,
    TaxonomyTreeComponent,
    SubBreadcrumbComponent,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    DynamicDialogModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    InputTextModule,
    TagModule,
    MultiSelectModule,
    PasswordModule,
    AvatarModule,
    BadgeModule,
    DropzoneModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    InputNumberModule,
    DropdownModule,
    ToggleButtonModule,
    CheckboxModule,
    TabViewModule,
    InputTextareaModule,
    KeyFilterModule,
    RatingModule,
    CalendarModule,
    InputMaskModule,
    ChipsModule,
    ChipModule,
    AutoCompleteModule,
    TreeSelectModule,
    InputSwitchModule,
    RadioButtonModule,
    SliderModule,
    SelectButtonModule,
    SidebarModule,
    ToastModule,
    TooltipModule,
    StepsModule,
    PanelMenuModule,
    MenuModule,
    PanelModule,
    AccordionModule,
    OrderListModule,
    ToolbarModule,
    TreeTableModule,
    SpeedDialModule,
    FieldsetModule,
    DividerModule,
    OverlayPanelModule,
    CardModule,
    VirtualScrollerModule,
    ProgressBarModule,
    LazyLoadImageModule,
    NgbModule,
    NgApexchartsModule,
    TieredMenuModule,
    SplitterModule,
    ChartModule,
    HighchartsChartModule,
    EditorModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    NgxPaginationModule,
    DragDropModule,
    GenericPipe,
    DynamicTableCellColorPipe,
    DynamicTableCellColorPipeStyle,
    DataTypePipe,
    StepperModule,
    SkeletonModule,
    DynamicChartsComponent,
    DynamicApexChartComponent,
    PeriodeMenuConfigComponent,
    ChartTableComponent,
    MapChartComponent,
    StatistiqueLoaderComponent,
    MenubarModule,
    MegaMenuModule,
    OrganizationChartModule,
  ],
  providers: [ConfirmationService, MessageService, DecimalPipe],
})
export class SharedModule {}
