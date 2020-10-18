import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';
import { AppConstant } from '@app/app.constants';


@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {
  @Input() public appAutoFocus;

  public constructor(private el: ElementRef) {}

  public ngAfterContentInit() {
    if (this.appAutoFocus || this.appAutoFocus === AppConstant.CT_EMPTY) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 500);
    }
  }
}
