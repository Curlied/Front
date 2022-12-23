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
    category: new FormControl('tous', [Validators.required]),
    date: new FormControl(undefined),
    code: new FormControl(undefined),
    department: new FormControl(''),
    numdepartment: new FormControl('tous', [Validators.required]),
  });

  constructor(private httpService: HttpService, private responseService: ResponseService) { }

  ngOnInit(): void {
    this.setup();
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

  changeDepartment() {
    const codeDepartment = this.searchFormGroup.get('numdepartment')?.value;

    if (codeDepartment == 'tous'){
      this.searchFormGroup.controls["code"].setValue(undefined);
      return;
    }
      
    // get all departement
    this.httpService.getCommuneByDepartmentCode(codeDepartment).subscribe({
      next: (res: any) => {

        const communesArray: any[] = res;
        this.arrayCommune = communesArray.sort((a, b) => (a.codesPostaux[0] > b.codesPostaux[0]) ? 1 : ((b.codesPostaux[0] > a.codesPostaux[0]) ? -1 : 0));
        
        // this.arrayCommune.forEach(x => {
        //   const nomDepartment = this.arrayDepartement.find(x => x.code == codeDepartment).nom;
        //   this.searchFormGroup.controls['department'].setValue(nomDepartment);
        // });
        const codePostauxFirst = this.arrayCommune[0].codesPostaux[0];
        const nomCommuneFirst = this.arrayCommune[0].nom;
        this.searchFormGroup.controls['code'].setValue(`${codePostauxFirst}-${nomCommuneFirst}`);
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      }
    });
  }


  submitSearch() {
    if (!this.searchFormGroup.valid) {
      const error: HttpErrorResponse = new HttpErrorResponse({ error: { message: "Les informations minimum sur la recherche ne sont pas renseignés" }, status: 304 })
      this.responseService.ErrorF(error);
      return;
    }
    let codeDepartment: any = this.searchFormGroup.get('numdepartment')?.value;
    // set the value for department to get the name
    if (codeDepartment != 'tous') {
      try {
        const nomDepartment = this.arrayDepartement.find(x => x.code == codeDepartment).nom;
        this.searchFormGroup.controls['department'].setValue(nomDepartment);
      } catch (error) {
        this.ngOnInit();
      }
    }
    else{
      this.searchFormGroup.controls['department'].setValue('tous');
    }
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
