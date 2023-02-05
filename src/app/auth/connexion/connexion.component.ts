import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ObservableService } from 'src/app/observable.service';
import { ResponseService } from 'src/app/response.service';
import { ToastObservableService } from 'src/app/toast.observable.service';

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
    private observableService: ObservableService
  ) {}

  ngOnInit(): void {}
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
