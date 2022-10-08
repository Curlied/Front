import { Injectable } from '@angular/core'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';



@Injectable({
  providedIn: 'root'
})

export class ObservableService {
  userStatut = new BehaviorSubject<boolean>(false);
  isAdmin = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private cookieService: CookieService, private httpService :HttpService) {
    const isConnect = this.cookieService.get('user_id'); 

    if (isConnect) {
      this.userStatut.next(true);
    }
    else{
      if(this.userStatut.getValue())
        this.logout();
      // this.router.navigateByUrl('');
    }

  }

  login(user_id: string) {
    if (!user_id) {
      return;
    }
    if (this.userStatut.getValue() == true)
      return
    this.cookieService.set("user_id", user_id, environment.timeToken ); 
    this.userStatut.next(true);
  }

  logout() {
    if (this.userStatut.getValue() == false)
      return
    this.httpService.postDisconnect().subscribe({
      next: (success :any)=>{
        this.cookieService.delete("user_id"); 
        this.userStatut.next(false);
        this.router.navigateByUrl('');
        this.isAdmin.next(false);
      },
      error: (err)=>{
        this.cookieService.delete("user_id"); 
        this.userStatut.next(false);
        this.router.navigateByUrl('');
        this.isAdmin.next(false);
      }
    })    
  }
  
  loginIsAdmin(value : boolean){
    if(!value)
      return;

      this.isAdmin.next(value);
  }

}