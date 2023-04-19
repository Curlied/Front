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
import { Meta,MetaDefinition } from '@angular/platform-browser';
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
    
  }
 

  

  ngOnInit(): void {
    const ogtitle: MetaDefinition =  { name: 'title',property: 'og:title', content: 'Connexion - Trouvez des amis et partagez des expériences grâce à notre application de création d’évènements '};
    const ogkeywords: MetaDefinition = {name: 'keywords',property: 'og:keywords', content:'evenement lyon, ynov, solitude,login,connexion, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly'};
    const ogdesc: MetaDefinition = {name: 'description', property: 'og:description', content: 'Connectez-vous à notre application de création d’évènements pour trouver des personnes partageant les mêmes centres d’intérêt que vous et organiser des sorties ensemble.'};
    this.metaService.addTag(ogtitle);
    this.metaService.addTag(ogkeywords);
    this.metaService.addTag(ogdesc);
  }

  ngOnDestroy() {
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("property='og:description'");
    this.metaService.removeTag("property='og:keywords'");
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
