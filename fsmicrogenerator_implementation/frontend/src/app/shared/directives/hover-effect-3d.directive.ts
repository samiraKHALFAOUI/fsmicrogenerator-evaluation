import { Directive, ElementRef, Input } from "@angular/core";
import { HelpersService } from "../services/defaultServices/helpers.service";

@Directive({
  selector: "[HoverEffect3D]",
})
export class HoverEffect3DDirective {
  @Input() threshold = 30;
  @Input() invertRotation = true;
  @Input() perspective = 500;
  @Input() scales = [1, 1];

  invertRotationValue = 0;

  ngOnInit() {
    this.invertRotationValue = this.invertRotation ? -1 : 1;
    this.scales[0] ??= 1;
    this.scales[1] ??= 1;
  }

  handleHovering(e: any) {
    const width = this.ref.nativeElement.clientWidth;
    const height = this.ref.nativeElement.clientHeight;

    const xVal = e.layerX;
    const yVal = e.layerY;

    const yRotation = this.invertRotationValue * this.threshold * ((xVal - width / 2) / width);
    const xRotation = -this.invertRotationValue * this.threshold * ((yVal - height / 2) / height);

    const shadowMaxOffset = 1.2;

    const shadowXOffset = this.invertRotationValue * this.helpers.mapValue(yRotation, -12, 14, -shadowMaxOffset, shadowMaxOffset);
    const shadowYOffset = -this.invertRotationValue * this.helpers.mapValue(xRotation, -12, 14, -shadowMaxOffset, shadowMaxOffset);

    this.ref.nativeElement.style.transform = `perspective(${this.perspective}px) scale(${this.scales[0]}, ${this.scales[1]}) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

    this.ref.nativeElement.style.boxShadow = `${shadowXOffset * 3}px ${shadowYOffset * 3}px 1px -2px rgb(0 0 0 / 20%),
                                              ${shadowXOffset * 2}px ${shadowYOffset * 2}px 2px  0px rgb(0 0 0 / 14%),
                                              ${shadowXOffset * 1}px ${shadowYOffset * 1}px 5px  0px rgb(0 0 0 / 12%),
                                              ${shadowXOffset * -1.5}px ${shadowYOffset * -1.5}px 1px  0px rgb(0 0 0 / 12%)`;
  }

  resetStyles() {
    this.ref.nativeElement.style.transform = `perspective(${this.perspective}px) scale(${this.scales[0]}, ${this.scales[1]}) rotateX(0deg) rotateY(0deg)`;
    this.ref.nativeElement.style.boxShadow = `0  3px 1px -2px rgb(0 0 0 / 20%), 0  2px 2px  0px rgb(0 0 0 / 14%), 0  1px 5px  0px rgb(0 0 0 / 12%), 0 -1px 1px  0px rgb(0 0 0 / 12%)`;
  }

  constructor(private ref: ElementRef, private helpers: HelpersService) {
    this.ref.nativeElement.addEventListener("mousemove", this.handleHovering.bind(this));
    this.ref.nativeElement.addEventListener("mouseleave", this.resetStyles.bind(this));
  }
}
