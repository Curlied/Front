import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/http.service';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ResponseService } from 'src/app/response.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ObservableService } from 'src/app/observable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creation-evenement',
  templateUrl: './creation-evenement.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./creation-evenement.component.css'],
})
export class CreationEvenementComponent implements OnInit {
  // public animation: boolean = false;
  // public multiple: boolean = true;

  arrayFile!: any[];
  arrayCategories!: any[];
  arrayDepartement!: any[];
  arrayCommune!: any[];

  //https://pivan.github.io/file-upload/
  public fileUploadControl = new FileUploadControl(
    { listVisible: true, accept: ['image/*'], discardInvalid: true },
    [
      FileUploadValidators.filesLimit(3),
      FileUploadValidators.accept(['image/*']),
      FileUploadValidators.fileSize(3000000),
    ]
  );

  currentDate = new Date().toISOString().slice(0, 10);

  eventForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(500),
    ]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    hour: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    adress: new FormControl('', [Validators.required]),
    place: new FormControl(''),
    time: new FormControl('', [Validators.required]),
    user_max: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    url_image: new FormControl(),
  });

  constructor(
    private httpService: HttpService,
    private router: Router,
    private observableService: ObservableService,
    private responseService: ResponseService
  ) {}

  ngOnInit(): void {
    if (!this.observableService.userStatut.getValue()) {
      const error: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Veuillez vous connecter svp !' },
        status: 401,
      });
      this.responseService.ErrorF(error);
    }
    this.setup();
  }

  setup() {
    // appel et récupération des catégories
    this.httpService.getAllCategories().subscribe({
      next: (res: any) => {
        // set des catégories
        this.arrayCategories = res.body.docs;
      },
      error: (err: any) => {
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

    this.arrayFile = [];
    this.fileUploadControl.valueChanges.subscribe((arrFile) => {
      this.uploadFile(arrFile);
    });

    this.fileUploadControl.discardedValueChanges.subscribe(() => {
      const error: HttpErrorResponse = new HttpErrorResponse({
        error: { message: "Veuillez insérer une image jusqu'a 3 mo svp" },
        status: 403,
      });
      this.responseService.ErrorF(error);
    });
  }

  uploadFile = (arrFile: any[]) => {
    const nbFile = arrFile.length;
    if (nbFile == 0) {
      this.arrayFile = [];
    } else {
      for (let index = 0; index < nbFile; index++) {
        if (this.arrayFile.indexOf(arrFile[index]) === -1) {
          this.arrayFile.push(arrFile[index]);
        } else {
          continue;
        }
      }
      this.eventForm.patchValue({
        url_image: this.arrayFile,
      });
    }
  };

  send() {
    try {
      const place = this.convertAdressDepartementAndPostalToPlace();
      this.eventForm.controls['place'].setValue(place);

      if (!this.eventForm.valid) {
        const error: HttpErrorResponse = new HttpErrorResponse({
          error: {
            message:
              "Les informations sur l'évènement ne sont pas tous renseignés ou sont incorrects",
          },
          status: 304,
        });
        this.responseService.ErrorF(error);
        return;
      }

      const departement = this.getDepartmentNameByCode();

      let formData = new FormData();
      formData.append('name', this.eventForm.get('name')?.value);
      formData.append('description', this.eventForm.get('description')?.value);
      formData.append('category', this.eventForm.get('category')?.value);
      formData.append('date_time', this.convertDateAndTimeToDateTime());
      formData.append(
        'place',
        `${this.eventForm.get('adress')?.value} ${
          this.eventForm.get('code')?.value
        } ${departement}`
      );
      formData.append('time', this.eventForm.get('time')?.value);
      formData.append('department', departement);
      formData.append('code', this.eventForm.get('code')?.value);
      formData.append('user_max', this.eventForm.get('user_max')?.value);
      formData.append('price', this.eventForm.get('price')?.value);
      let Images = this.eventForm.get('url_image')?.value;

      for (let i = 0; i < Images?.length; i++) {
        formData.append('url_image' + i, Images[i], Images[i].name);
      }

      this.httpService.postAddEvent(formData).subscribe({
        next: (res: any) => {
          this.responseService.SuccessF(res);
          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          this.responseService.ErrorF(err);
        },
      });
    } catch (e) {
      this.ngOnInit();
    }
  }

  convertDateAndTimeToDateTime() {
    let date = this.eventForm.get('date')?.value;
    let hour = this.eventForm.get('hour')?.value;

    const dateTime = new Date(`${date} ${hour}`).toLocaleString([], {
      day: 'numeric',
      year: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return dateTime;
  }

  convertAdressDepartementAndPostalToPlace() {
    return `${this.eventForm.get('adress')?.value} ${
      this.eventForm.get('code')?.value
    } ${this.eventForm.get('department')?.value}`;
  }

  changeDepartment() {
    const codeDepartment = this.eventForm.get('department')?.value;
    this.getDepartmentNameByCode();
    // get all departement
    this.httpService.getCommuneByDepartmentCode(codeDepartment).subscribe({
      next: (res: any) => {
        this.arrayCommune = res.sort(this.compareDepartment);
        const codePostauxFirst = this.arrayCommune[0].codesPostaux[0];
        const nomCommuneFirst = this.arrayCommune[0].nom;
        this.eventForm.controls['code'].setValue(
          `${codePostauxFirst}-${nomCommuneFirst}`
        );
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });
  }

  compareDepartment(a: any, b: any) {
    if (a.codesPostaux[0] > b.codesPostaux[0]) {
      return 1;
    } else if (b.codesPostaux[0] > a.codesPostaux[0]) {
      return -1;
    }

    return 0;
  }

  getDepartmentNameByCode() {
    const codeDepartment = this.eventForm.get('department')?.value;
    return this.arrayDepartement.find((x) => x.code == codeDepartment).nom;
  }
}
