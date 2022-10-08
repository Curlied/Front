import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { allTypeToast } from './Models/toast';
import { ObservableService } from 'src/app/observable.service';
import { Router } from '@angular/router';
import { ToastObservableService } from './toast.observable.service';

@Injectable({
  providedIn: 'root'
})

export class ResponseService {


  constructor(private observableservice: ObservableService, 
    private toastObservableService : ToastObservableService,
    private router: Router)
  {

  }
  /** Return a toast for print a message error
   * @param error the error response
   * @returns A toast model
   */
  ErrorF: any = (error: HttpErrorResponse) => {
    if (error.status == 0) {
      error.error.message = "Le serveur distant n'est pas joignable";
    }
    if(error.status == 401)
    {
      error.error.message = "Vous n'êtes pas connecté ou autorisé";
      this.observableservice.logout();
      this.router.navigateByUrl('/connexion');
    }
    if(error.status == 404)
    {
      this.router.navigateByUrl('');
    }
    const toast = {
      isShow: true,
      message: error.error.message,
      type: allTypeToast.error
    };
    
    this.toastObservableService.activeToast(toast);
  }


  /** Return a toast for print a success message
   * @param message The message to display on the toast 
   * @returns A toast model
   */
  SuccessF: any = (res:any) => {
    const toast =  {
      isShow: true,
      message: res.message,
      type: allTypeToast.success
    }

    this.toastObservableService.activeToast(toast);
  }
}