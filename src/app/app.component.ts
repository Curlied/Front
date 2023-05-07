import { Component, ElementRef, ViewChild } from '@angular/core';
import { TalkjsService } from './talkjs.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public showTemplate: boolean = true;
  private urls = ['/connexion', '/inscription', '/confirm', '/error'];
  alertInstallPwaShow: boolean = true;
  constructor(
    private talkService: TalkjsService,
    private jwt: JwtHelperService
  ) {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    if (decodedToken) {
      const user = {
        id: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
        welcomeMessage: 'Hey there! How are you? :-)',
        role: 'default',
      };
      this.talkService.createCurrentSession(user);
    }
  }

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
