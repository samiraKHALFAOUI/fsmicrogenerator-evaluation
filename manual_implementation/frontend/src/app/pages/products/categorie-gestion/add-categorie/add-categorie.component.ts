import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { CategorieService } from "../../../../core/services/productManagment-service/categorie.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-add-categorie",
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: "./add-categorie.component.html",
  styleUrl: "./add-categorie.component.scss",
})
export class AddCategorieComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      icon: ["", []],
      name: ["", [Validators.required]],
    });
  }

  addCategorie() {
    console.log("🚀 ~ AddCategorieComponent ~ this.categorieService.createCategory ~ this.form.value:", this.form.value)
    this.categorieService.createCategory(this.form.value).subscribe((res) => {
      console.log(
        "🚀 ~ AddCategorieComponent ~ this.categorieService.createCategory ~ res:",
        res
      );
      this.activeModal.close(res);
    });
  }
}
