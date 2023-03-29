import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { ResponseService } from 'src/app/response.service';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
})
export class AccueilComponent implements OnInit {
  bucketEvent =
    environment.bucketImagesBasePath + environment.folderBucketEventPictures;
  arrayCategories!: any[];
  arrayEvent!: any[];
  arrayDepartement!: any[];
  arrayCommune!: any[];
  dateMin!: any;

  searchFormGroup = new UntypedFormGroup({
    category: new UntypedFormControl('tous', [Validators.required]),
    date: new UntypedFormControl(undefined),
    department: new UntypedFormControl(''),
    numdepartment: new UntypedFormControl('tous', [Validators.required]),
  });

  constructor(
    private httpService: HttpService,
    private responseService: ResponseService,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.setup();
    window.scroll(0, 0);
    const ogtitle: MetaDefinition = {
      name: 'title',
      property: 'og:title',
      content: 'Curlied - Rejoins ou organise des événements',
    };
    const ogkeywords: MetaDefinition = {
      name: 'keywords',
      property: 'og:keywords',
      content:
        'evenement lyon, ynov, solitude, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
    };
    const ogdesc: MetaDefinition = {
      name: 'description',
      property: 'og:description',
      content:
        'Curlied est un site web permettant de créer ou de rejoindre des événements divers pour rencontrer des personnes partageant les mêmes centres d’intérêt',
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
  /**Fetch categories, events, and department
   *
   */
  setup() {
    this.dateMin = Date.now();

    // get categories
    this.httpService.getAllCategories().subscribe({
      next: (res: any) => {
        this.arrayCategories = res.body.docs;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });

    // get allEvent
    this.httpService.getAllEvent().subscribe({
      next: (res: any) => {
        this.arrayEvent = res.body;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });

    // get all departement
    this.httpService.getDepartementOnRegion().subscribe({
      next: (res: any) => {
        this.arrayDepartement = res;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });
  }

  submitSearch() {
    if (!this.searchFormGroup.valid) {
      const error: HttpErrorResponse = new HttpErrorResponse({
        error: {
          message:
            'Les informations minimum sur la recherche ne sont pas renseignées',
        },
        status: 304,
      });
      this.responseService.ErrorF(error);
      return;
    }
    this.searchFormGroup.controls['department'].setValue('tous');
    // fix problem for date imput clear as string empty
    if (this.searchFormGroup.get('date')?.value == '') {
      this.searchFormGroup.controls['date']?.setValue(undefined);
    }

    this.httpService
      .postSearchEventAllEventPage(this.searchFormGroup.value)
      .subscribe({
        next: (res: any) => {
          this.arrayEvent = res.body;
        },
        error: (err: any) => {
          this.responseService.ErrorF(err);
        },
      });
  }
}
