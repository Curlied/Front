import { ngfactoryFilePath } from '@angular/compiler/src/aot/util';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public showTemplate: boolean = true;
  private urls = ['/connexion', '/inscription', '/confirm','/error'];

  constructor(private location: Location) {}

  ngOnInit() {
    // this.showTemplate = !this.urls.includes(location.pathname);
  }
}
