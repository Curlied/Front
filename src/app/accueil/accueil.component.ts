import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { ResponseService } from 'src/app/response.service';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  constructor(private httpService : HttpService, private responseService: ResponseService) { }

  arrayCategories!: any[];
  data: any = {};

  InfoEnvironnement = {
    AdresseAPI : environment.AdresseAPI,
    appVersion: environment.appVersion,
    nomEnvironnement: environment.nomEnvironnement
  }


  ngOnInit(): void {
    this.httpService.getPing().subscribe({
      next :(res) => { 
        this.data = res ;
      },
      error : (err)=> { 
        console.log(err);
      }
    });
    this.setup();
  }

  /**Fetch categories
   * 
  */
   setup() {

    // get categories
    this.httpService.getAllCategories().subscribe({
      next: (res: any) => {
        this.arrayCategories = res.body.docs;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      }
    });
  }

}
