import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ObservableService } from 'src/app/observable.service';
import { ResponseService } from 'src/app/response.service';
import { ToastObservableService } from 'src/app/toast.observable.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(
    private httpService: HttpService,
    private router: Router,
    private responseService: ResponseService,
    private observableService: ObservableService,
    private metaService:Meta
  ) {
    this.addTags();
  }
  //ajout des tags
addTags(){
  this.metaService.addTags([
    {name:'title', content:'page connexion'},  
    { name: 'description', content: 'Page de connexion'}, 
    { name: 'keywords', content: 'evenement lyon, ynov, solitude,login,connexion, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly'} 
]);
}
//permet d'afficher le rendu html des tags
getTag(){
  this.metaService.addTag({name:'title', content:'page connexion'})
  this.metaService.addTag({ name: 'description', content: 'Page de connexion'})
  this.metaService.addTag({ name: 'keywords', content: 'evenement lyon, ynov, solitude,login,connexion, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly'} )
}
  ngOnInit(): void {
    
  }
  login() {
    this.httpService.postLogin(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.observableService.login(res.body);
        localStorage.setItem('token', res.body.token);

        this.httpService.getRoles().subscribe({
          next: (res: any) => {
            const body = res.body;
            this.observableService.loginIsAdmin(body.includes('admin'));
          },
        });

        this.router.navigateByUrl('');
      },

      error: (err: any) => {
        this.responseService.ErrorF(err);
      },
    });
  }
}
