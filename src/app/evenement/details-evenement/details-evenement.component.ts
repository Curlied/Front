import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';
import { Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-evenement',
  templateUrl: './details-evenement.component.html',
  styleUrls: ['./details-evenement.component.css'],
})
export class DetailsEvenementComponent implements OnInit {
  bucketEvent =
    environment.bucketImagesBasePath + environment.folderBucketEventPictures;
  event: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: Meta,
    private httpService: HttpService,
    private responseService: ResponseService
  ) {
    this.addTags();
  }

  addTags() {
    this.metaService.addTags([
      {
        name: 'title',
        content:
          ' rencontrez de nouveaux amis et amusez-vous ensemble grâce à notre application de création d’évènements amicaux',
      },
      {
        name: 'description',
        content:
          'Rencontrez de nouveaux amis et explorez des activités passionnantes avec notre application de rencontre amicale. Découvrez les événements locaux organisés par des gens comme vous, qui cherchent à se faire des amis et à s’amuser ensemble. Que vous soyez nouveau dans la ville ou que vous cherchiez simplement à élargir votre cercle social, notre application conviviale vous permettra de rencontrer des gens partageant les mêmes centres d’intérêts et de créer des amitiés durables.',
      },
      {
        name: 'keywords',
        content:
          'evenement lyon, ynov, solitude,details,detail,evenements,evenement, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
      },
    ]);
  }

  getTag() {
    this.metaService.addTag({ name: 'title', content: '' });
    this.metaService.addTag({ name: 'description', content: '' });
    this.metaService.addTag({
      name: 'keywords',
      content:
        'evenement lyon, ynov, solitude,details,detail,evenements,evenement, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
    });
  }

  canParticipate!: boolean;
  event_id: any;
  user_id: any;

  ngOnInit() {
    this.getParamsOrRedirect();
    window.scroll(0, 0);
  }

  getParamsOrRedirect() {
    this.route.queryParams.subscribe((params) => {
      this.event_id = params['event'];
    });

    if (!this.event_id) {
      this.router.navigate(['./']);
    } else {
      this.getDetailsEvent(this.event_id);
    }
  }

  getDetailsEvent = (event_id: any) => {
    this.httpService.getDetailsEventById(event_id).subscribe({
      next: (res: any) => {
        this.event = res.body;
        this.canParticipate = this.event.users.length + 1 < this.event.user_max;
      },
      error: (err) => {
        this.responseService.ErrorF(err);
      },
    });
  };

  requestParticipate = (event_id: string) => {
    this.httpService.putSubmitParticipation(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.ngOnInit();
      },
      error: (err) => {
        this.responseService.ErrorF(err);
      },
    });
  };

  cancelParticipate = (event_id: string) => {
    this.httpService.cancelEventParticipation(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.ngOnInit();
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      },
    });
  };

  acceptParticipate = (event_id: string, user_id: string) => {
    this.httpService.acceptUserEvent(event_id, user_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.ngOnInit();
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      },
    });
  };
}
