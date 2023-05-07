import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-details-evenement',
  templateUrl: './details-evenement.component.html',
  styleUrls: ['./details-evenement.component.css'],
})
export class DetailsEvenementComponent implements OnInit {
  bucketEvent =
    environment.bucketImagesBasePath + environment.folderBucketEventPictures;
  bucket =
    environment.bucketImagesBasePath + environment.folderBucketGlobalPictures;
  event: any;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaService: Meta,
    private httpService: HttpService,
    private responseService: ResponseService,
    private jwt: JwtHelperService
  ) {}

  ngOnInit(): void {
    this.getParamsOrRedirect();
    window.scroll(0, 0);
    const ogtitle: MetaDefinition = {
      name: 'title',
      property: 'og:title',
      content:
        'Rencontrez de nouveaux amis et amusez-vous ensemble grâce à notre application de création d’évènements amicaux',
    };
    const ogkeywords: MetaDefinition = {
      name: 'keywords',
      property: 'og:keywords',
      content:
        'Evenement lyon, ynov, solitude,details,detail,evenements,evenement, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly',
    };
    const ogdesc: MetaDefinition = {
      name: 'description',
      property: 'og:description',
      content:
        'Rencontrez de nouveaux amis et explorez des activités passionnantes avec notre application de rencontre amicale. Découvrez les évènements locaux organisés par des gens comme vous, qui cherchent à se faire des amis et à s’amuser ensemble. Que vous soyez nouveau dans la ville ou que vous cherchiez simplement à élargir votre cercle social, notre application conviviale vous permettra de rencontrer des gens partageant les mêmes centres d’intérêts et de créer des amitiés durables.',
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

  isCurrentUser(userId: any) {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    if (userId == decodedToken['userId']) return true;
    return false;
  }

  canParticipate!: boolean;
  event_id: any;
  user_id: any;
  connected_user_id: any;

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
    this.isLoading = true;
    this.httpService.getDetailsEventById(event_id).subscribe({
      next: (res: any) => {
        this.event = res.body;
        this.canParticipate =
          this.event.users_valide.length + 1 < this.event.user_max;
        this.isLoading = false;
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

  messageUser(userId: string, userName: string) {
    this.router.navigate(['./messages'], {
      queryParams: { user: userId, name: userName, isGroup: false },
    });
  }

  messageGroup() {
    this.router.navigate(['./messages'], {
      queryParams: { group: this.event_id, isGroup: true },
    });
  }

  formatDate(dateString: string): string {
    const options = {
      timeZone: 'Europe/Paris',
      day: '2-digit' as const,
      month: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(
      new Date(dateString)
    );
  }
}
