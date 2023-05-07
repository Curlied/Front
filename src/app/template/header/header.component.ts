import { TalkjsService } from 'src/app/talkjs.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ObservableService } from 'src/app/observable.service';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isConnected: any;
  isAdmin: any = false;
  haveNewMessage: any = false;
  isMessages = false;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

  constructor(
    private observableService: ObservableService,
    public talkjs: TalkjsService,
    private jwt: JwtHelperService
  ) {
    const token = localStorage.getItem('token') || '';
    if (token != '') {
      const isExpired = this.jwt.isTokenExpired(token);
      if (!isExpired) {
        this.isMessages = true;
        this.talkjs.obsHaveUnreadMessages.subscribe((data: boolean) => {
          this.haveNewMessage = data;
        });
      }
      this.isMessages = !isExpired;
    } else {
      this.isMessages = false;
    }
  }

  async ngOnInit(): Promise<void> {
    this.observableService.userStatut.subscribe(
      (data) => (this.isConnected = data)
    );
    this.observableService.isAdmin.subscribe((data) => (this.isAdmin = data));
  }

  async ngAfterViewInit() {}

  handleCloseMenu() {
    new bootstrap.Collapse(this.menuToggle.nativeElement);
  }

  logout() {
    this.observableService.logout();
  }
}
