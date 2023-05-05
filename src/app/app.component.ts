import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public showTemplate: boolean = true;
  private urls = ['/connexion', '/inscription', '/confirm', '/error'];
  alertInstallPwaShow: boolean = true;
  constructor() {}

  ngDoCheck() {
    this.showTemplate = !this.urls.includes(location.pathname);
  }

  /**
   * Affiche l'alerte qui invite l'utilisateur à installer la PWA
   * @param event true = affiche, false = cache
   */
  showAlert(event: any) {
    this.alertInstallPwaShow = event;
  }
}
