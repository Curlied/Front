import { Platform } from '@angular/cdk/platform';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-alert-pwa',
  templateUrl: './alert-pwa.component.html',
  styleUrls: ['./alert-pwa.component.css']
})
export class AlertPwaComponent {
  pwaPlatform: string | undefined;
  alertPwaEvent: any;

  /**
   * Evenement qui permet de changer le statut de l'alerte
   * true = affichage, false = cache
   */
  @Output("show") show = new EventEmitter<boolean>(false);

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.loadAlertPwa();
  }

  /**
   * Charge l'alerte et rempli les informations concernant 
   * la plateforme ou est actuellement lancé le site (browser, ios, android...)
   */
  private loadAlertPwa() {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.alertPwaEvent = event;
        this.pwaPlatform = 'ANDROID';
        this.show.emit(true);
        return;
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.pwaPlatform = 'IOS';
        this.show.emit(true);
        return;
      }
    }

    if (this.platform.isBrowser) { // Vérification si la plateforme est le navigateur
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.alertPwaEvent = event;
        this.pwaPlatform = 'BROWSER';
        this.show.emit(true);
        return;
      });
    }
  }

  /**
   * Quand l'utilisateur clique sur l'alerte d'installation de la PWA
   * il déclenche me prompre et ca cache l'alerte
   */
  public addToHomeScreen(): void {
    this.alertPwaEvent.prompt().then(() => {
      this.show.emit(false);
    });
  }

}
