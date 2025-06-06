import { Component, Input } from '@angular/core';
import { Customer } from '../../../../shared/models/customer';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ImageUrlPipe } from '../../../../shared/pipess/image-url.pipe';

@Component({
  selector: 'app-customer-detail',
  imports: [
    CommonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    RippleModule,
    CardModule,
    DividerModule,
    AvatarModule,
    ReactiveFormsModule,
    ImageUrlPipe,
    ImageModule
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent {
  @Input() customer: Customer | null = null;
}