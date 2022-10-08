import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { toastInfo } from './Models/toast';



@Injectable({
  providedIn: 'root'
})
export class ToastObservableService {

  toastStatut = new BehaviorSubject<any>(undefined);

  activeToast(toastInfo :toastInfo) {
    if (this.toastStatut.getValue() == true) {
      return;
    }

    this.toastStatut.next(toastInfo);

    setTimeout(()=>{
      this.toastStatut.next(undefined);
    },3000);
  }


}