import { Directive, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[hideIsProd]'
})
export class IsProdDirective {

  constructor(private ref: ElementRef<HTMLElement>) {}
  ngAfterViewInit(): void {
    if (environment.production) 
      this.ref.nativeElement?.remove();
  }

}
