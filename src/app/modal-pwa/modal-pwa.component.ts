import { Component, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-modal-pwa',
  templateUrl: './modal-pwa.component.html',
  styleUrls: ['./modal-pwa.component.css']
})
export class ModalPwaComponent {
  modalPwaPlatform: string | undefined;
  modalPwaEvent: any;
  deferredPrompt: any;
  modalRef!: NgbModalRef;

  @ViewChild("content") modalPwa!: any;

  constructor(private modalService: NgbModal, private platform: Platform) { }



  ngAfterViewInit(): void {
    this.loadModalPwa();
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
        this.modalRef = this.modalService.open(this.modalPwa);
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }

    if (this.platform.isBrowser) { // Vérification si la plateforme est le navigateur
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'BROWSER';
        this.modalRef = this.modalService.open(this.modalPwa);
      });
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt().then(() => {
      this.modalRef.close();
    });
    this.modalRef.close();
  }

}
