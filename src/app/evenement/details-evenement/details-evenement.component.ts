import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';

@Component({
  selector: 'app-details-evenement',
  templateUrl: './details-evenement.component.html',
  styleUrls: ['./details-evenement.component.css']
})
export class DetailsEvenementComponent implements OnInit {

  event: any;
  constructor(private router: Router, private route: ActivatedRoute, 
    private httpService: HttpService, private responseService: ResponseService) { }
  
  canParticipate! : boolean;
  event_id :any;
  ngOnInit() {
    this.getParamsOrRedirect();
    window.scroll(0,0);
  }

  getParamsOrRedirect()
  {
    this.route.queryParams.subscribe(params => {
      this.event_id = params['event'];
    });

    if (!this.event_id) {
      this.router.navigate(['./']);
    }
    else {
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
      }
    });
  }

  requestParticipate= (event_id :string)=>{
    this.httpService.putSubmitParticipation(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.ngOnInit();
      },
      error: (err) => {
        this.responseService.ErrorF(err);
      }
    });
  }

  cancelParticipate= (event_id :string)=>{
    this.httpService.cancelEventParticipation(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.ngOnInit();
      },
      error: (err:any) => {
        this.responseService.ErrorF(err);
      }
    });
  }
}