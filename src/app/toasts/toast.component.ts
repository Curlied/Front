import { Component, Input, OnInit } from '@angular/core';
import { toastInfo } from '../Models/toast';
import { ToastObservableService } from '../toast.observable.service';


declare var bootstrap:any;
declare var $ :any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})


export class ToastComponent implements OnInit {

  myToast:any;

  _toastInf!: toastInfo;

  set toastInf(toastInfo: any) {

    if(toastInfo == undefined || !this.myToast)
    {
      var myToastEl = document.getElementById('toast')
      this.myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);
      return;
    }

    if(!toastInfo.isShow){
      return;
    }
    else{
      this._toastInf = toastInfo;
      this.myToast.show();
    }
  }
  constructor(private toastObservableService : ToastObservableService) {
    this.toastObservableService.toastStatut.subscribe(data => this.toastInf = data);
  }

  ngOnInit(): void {
    var myToastEl = document.getElementById('toast')
    this.myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);

    // not funny because I can't find how 
    // I can hide this toast without showing it forward
    // ☹☹😲
    this.myToast.show();
    this.myToast.hide();
  }

}
