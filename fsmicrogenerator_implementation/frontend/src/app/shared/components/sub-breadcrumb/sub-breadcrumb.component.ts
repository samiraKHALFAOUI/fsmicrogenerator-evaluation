import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BreadcrumbsService } from 'src/app/shared/services/defaultServices/breadcrumbs.service';
import { BreadcrumbItem } from 'src/app/shared/models/defaultModels/breadcrumb-item';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-sub-breadcrumb',
  templateUrl: './sub-breadcrumb.component.html',
  styleUrls: ['./sub-breadcrumb.component.scss'],
})
export class SubBreadcrumbComponent implements OnInit {
  breadcrumbs!: BreadcrumbItem[];
  @Input() module = 'gestion-entreprise';
  @Input() component = 'entreprise';
  @Input() operation = 'add';
  title = '';
  @Input() edit = false;
  @Output() OnClose = new EventEmitter();
  constructor(

    private breadcrumbsService: BreadcrumbsService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit(): void {
    let data: any = this.breadcrumbsService.getRoute(
      this.module,
      this.component,
      this.operation === 'add/edit'
        ? this.edit
          ? 'edit'
          : 'add'
        : this.operation
    );

    this.breadcrumbsService.addBreadcrumb(data);
    this.breadcrumbs = this.breadcrumbsService.getBreadcrumbs();
    this.title = this.breadcrumbs[this.breadcrumbs.length - 1].espace;
  }
  close(index: number) {
    if (index === 0) {
      this.dialogService.dialogComponentRefMap.forEach((ref) => ref.destroy());
      this.breadcrumbsService.clear();
    } else {
      let type = this.breadcrumbs[index]['type'];
      let i = 0;
      for (const [key, value] of this.dialogService.dialogComponentRefMap) {
        if (type === 'list') {
          if (index / 2 === i) {
            key.destroy();
            this.breadcrumbsService.removeBreadcrumb();
          } else {
            if (i > index / 2) {
              key.destroy();
              this.breadcrumbsService.removeBreadcrumb();
            }
          }
          i++;
        } else {
          if (i > index / 2) {
            key.destroy();
            this.breadcrumbsService.removeBreadcrumb();
          }
          i++;
        }
      }
    }
  }

}
