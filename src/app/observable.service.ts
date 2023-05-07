import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class ObservableService {
  userStatut = new BehaviorSubject<boolean>(false);
  isAdmin = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private httpService: HttpService,
    private jwt: JwtHelperService
  ) {
    const token = localStorage.getItem('token') || '';
    let isConnect = false;
    if (token != '') {
      const isExpired = this.jwt.isTokenExpired(token);
      if (!isExpired) {
        isConnect = true;
      }
    }
    if (isConnect) {
      this.userStatut.next(true);
    } else {
      if (this.userStatut.getValue()) this.logout();
      // this.router.navigateByUrl('');
    }
  }

  login(user_id: string) {
    if (!user_id) {
      return;
    }
    if (this.userStatut.getValue() == true) return;
    this.cookieService.set('user_id', user_id, environment.timeToken);
    this.userStatut.next(true);
  }

  logout() {
    if (this.userStatut.getValue() == false) return;
    this.httpService.postDisconnect().subscribe({
      next: (success: any) => {
        // remove token from local storage to log user out
        localStorage.removeItem('token');
        this.userStatut.next(false);
        this.router.navigateByUrl('connexion');
        this.isAdmin.next(false);
      },
      error: (err) => {
        localStorage.removeItem('token');
        this.userStatut.next(false);
        this.router.navigateByUrl('connexion');
        this.isAdmin.next(false);
      },
    });
  }

  loginIsAdmin(value: boolean) {
    if (!value) return;

    this.isAdmin.next(value);
  }
}
