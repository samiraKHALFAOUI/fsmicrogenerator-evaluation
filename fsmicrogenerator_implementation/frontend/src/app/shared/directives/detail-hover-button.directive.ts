import { Directive, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Directive({
  selector: "[DetailHoverButton]",
})
export class DetailHoverButtonDirective {
  @Input() icon = "pi pi-link";
  @Input() label = "code_4170";
  @Input() color: "blue" | "indigo" = "blue";

  @Output() onButtonClick = new EventEmitter();

  constructor(private ref: ElementRef, private helpers: HelpersService) {}

  ngOnInit() {
    const icon = document.createElement("i");
    icon.setAttribute("class", `icon ${this.icon ?? "pi pi-link"}`);

    const spanIcon = document.createElement("span");
    spanIcon.setAttribute("class", "detail-hover-button-icon");
    spanIcon.appendChild(icon);

    const label = document.createElement("div");
    label.setAttribute("class", "detail-hover-button-label");

    label.appendChild(document.createTextNode(this.helpers.translateTitle(this.label)));


    const spanContainer = document.createElement("span");
    spanContainer.setAttribute("class", `detail-hover-button detail-hover-button-${this.color}`);
    spanContainer.addEventListener("click", (e) => {
      this.onButtonClick.emit(e);
    });
    spanContainer.appendChild(label);
    spanContainer.appendChild(spanIcon);

    this.ref.nativeElement.setAttribute("class", `${this.ref.nativeElement.getAttribute("class")} detail-hover-button-parent`);
    this.ref.nativeElement.appendChild(spanContainer);
  }
}
