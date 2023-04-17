import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img',
})
export class ImageLoadedDirective {
  constructor(private el: ElementRef) {}

  @HostListener('load') onLoad() {
    const img = this.el.nativeElement as HTMLImageElement;
    img.classList.add('loaded');
  }
}
