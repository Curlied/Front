import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ObservableService } from 'src/app/observable.service';
declare var bootstrap: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isConnected: any;
  isAdmin: any = false;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

  constructor(private observableService: ObservableService) {}

  ngOnInit(): void {
    this.observableService.userStatut.subscribe(
      (data) => (this.isConnected = data)
    );
    this.observableService.isAdmin.subscribe((data) => (this.isAdmin = data));
  }

  handleCloseMenu() {
    new bootstrap.Collapse(this.menuToggle.nativeElement);
  }

  logout() {
    this.observableService.logout();
  }
}
