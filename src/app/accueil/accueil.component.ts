import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { ResponseService } from 'src/app/response.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  arrayCategories!: any[];
  arrayEvent!: any[];
  arrayDepartement!: any[];
  arrayCommune!: any[];
  dateMin!: any;
  
  searchFormGroup = new FormGroup({
    category: new FormControl("tous", [Validators.required]),
    date: new FormControl(undefined),
    department: new FormControl(''),
    numdepartment: new FormControl('tous', [Validators.required]),
  });

  constructor(private httpService: HttpService, private responseService: ResponseService) { }
 
  ngOnInit(): void {
    this.setup();
    window.scroll(0,0);
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
      }
    });

   // get allEvent
   this.httpService.getAllEvent().subscribe({
    next: (res: any) => {
      // this.arrayEvent = res.body.docs;
      this.arrayEvent = res.body;
    },
    error: (err): any => {
      this.responseService.ErrorF(err);
    }
  });

  // get all departement
  this.httpService.getDepartementOnRegion().subscribe({
    next: (res: any) => {
      this.arrayDepartement = res;
    },
    error: (err): any => {
      this.responseService.ErrorF(err);
    }
  });
}

submitSearch() {
  if (!this.searchFormGroup.valid) {
    const error: HttpErrorResponse = new HttpErrorResponse({ error: { message: "Les informations minimum sur la recherche ne sont pas renseignées" }, status: 304 })
    this.responseService.ErrorF(error);
    return;
  }
  this.searchFormGroup.controls['department'].setValue('tous');
  // fix problem for date imput clear as string empty
  if (this.searchFormGroup.get('date')?.value == "") {
    this.searchFormGroup.controls['date']?.setValue(undefined);
  }

  this.httpService.postSearchEventAllEventPage(this.searchFormGroup.value).subscribe({
    next: (res: any) => {
      this.arrayEvent = res.body;
    },
    error: (err: any) => {
      this.responseService.ErrorF(err);
    }
  })
}

}
