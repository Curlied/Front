import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ObservableService } from 'src/app/observable.service';
import { ResponseService } from 'src/app/response.service';
import { Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent implements OnInit {
  global_bucket_images =
    environment.bucketImagesBasePath + environment.folderBucketGlobalPictures;
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
    private metaService: Meta
  ) {
    this.addTags();
  }
  //ajout des tags
  addTags() {
    this.metaService.addTags([
      {
        name: 'title',
        content:
          'Connexion - Trouvez des amis et partagez des expériences grâce à notre application de création d’événements ',
      },
      {
        name: 'description',
        content:
          'Connectez-vous à notre application de création d’événements pour trouver des personnes partageant les mêmes centres d’intérêt que vous et organiser des sorties ensemble.',
      },
      {
        name: 'keywords',
        content:
          'evenement lyon, ynov, solitude,login,connexion, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
      },
    ]);
  }
  //permet d'afficher le rendu html des tags
  getTag() {
    this.metaService.addTag({ name: 'title', content: '' });
    this.metaService.addTag({ name: 'description', content: '' });
    this.metaService.addTag({ name: 'keywords', content: '' });
  }
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
