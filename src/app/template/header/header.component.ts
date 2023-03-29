import { Component, OnInit } from '@angular/core';
import { ObservableService } from 'src/app/observable.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isConnected: any;
  isAdmin: any = false;
  constructor(private observableService: ObservableService) {}

  ngOnInit(): void {
    this.observableService.userStatut.subscribe(
      (data) => (this.isConnected = data)
    );
    this.observableService.isAdmin.subscribe((data) => (this.isAdmin = data));
  }

  logout() {
    this.observableService.logout();
  }
}
