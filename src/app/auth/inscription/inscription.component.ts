import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  currentDate = new Date().toISOString().slice(0, 10);
  global_bucket_images =
    environment.bucketImagesBasePath + environment.folderBucketGlobalPictures;

  profileForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirm_password: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    birth_date: new UntypedFormControl('', [Validators.required]),
    telephone: new UntypedFormControl('', [Validators.pattern(/(^[0-9]+$)/)]),
    url_image: new UntypedFormControl(),
  });

  constructor(
    private httpService: HttpService,
    private responseService: ResponseService,
    private metaService: Meta,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ogtitle: MetaDefinition = {
      name: 'title',
      property: 'og:title',
      content:
        'Inscrivez-vous pour rencontrer de nouveaux amis et vous amuser avec notre application de création d’évènements',
    };
    const ogkeywords: MetaDefinition = {
      name: 'keywords',
      property: 'og:keywords',
      content:
        'evenement lyon, ynov, solitude,login,connexion,inscription,register, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
    };
    const ogdesc: MetaDefinition = {
      name: 'description',
      property: 'og:description',
      content:
        'Inscrivez-vous à notre site de rencontre amical pour rencontrer des personnes partageant les mêmes centres d’intérêt que vous et organiser des sorties ensemble. Notre application de création d’évènements vous permettra de vous amuser tout en élargissant votre cercle social.',
    };
    this.metaService.addTag(ogtitle);
    this.metaService.addTag(ogkeywords);
    this.metaService.addTag(ogdesc);
  }

  ngOnDestroy() {
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("property='og:description'");
    this.metaService.removeTag("property='og:keywords'");
  }

  register() {
    let formData = new FormData();
    formData.append('username', this.profileForm.get('username')?.value);
    formData.append('email', this.profileForm.get('email')?.value);
    formData.append('password', this.profileForm.get('password')?.value);
    formData.append(
      'confirm_password',
      this.profileForm.get('confirm_password')?.value
    );
    formData.append('birth_date', this.profileForm.get('birth_date')?.value);
    formData.append('telephone', this.profileForm.get('telephone')?.value);

    let image = this.profileForm.get('url_image')?.value;
    if (image) formData.append('url_image', image, image.name);

    this.httpService.postRegister(formData).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.router.navigate(['/connexion']);
      },

      error: (err: any) => {
        this.responseService.ErrorF(err);
      },
    });
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    this.profileForm.patchValue({
      url_image: file,
    });
  }
}
