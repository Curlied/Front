import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public showTemplate: boolean = true;
  private urls = ['/connexion', '/inscription', '/confirm','/error'];

  ngDoCheck() {
    this.showTemplate = !this.urls.includes(location.pathname);
  }
}
