import { Component, OnInit } from '@angular/core';
import { allTypeToast, toastInfo } from 'src/app/Models/toast';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ObservableService } from '../observable.service';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { ResponseService } from '../response.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  public animation: boolean = false;
  public multiple: boolean = true;

  arrayEventValidate!: any[];
  arrayEventNotValidate!: any[];
  toastInfo!: toastInfo;
  arrayFile!: any[];

  //https://pivan.github.io/file-upload/
  public fileUploadControl = new FileUploadControl(
    { listVisible: true, accept: ['image/*'], discardInvalid: true },
    [
      FileUploadValidators.filesLimit(3),
      FileUploadValidators.accept(['image/*']),
      FileUploadValidators.fileSize(3000000),
    ]
  );

  constructor(
    private observableService: ObservableService,
    private router: Router,
    private httpService: HttpService,
    private responseService: ResponseService
  ) {
    this.observableService.userStatut.subscribe((isAdmin) => {
      // if (!isAdmin) {
      //   this.router.navigateByUrl('');
      // }
    });
  }

  ngOnInit(): void {
    this.arrayFile = [];
    this.fileUploadControl.valueChanges.subscribe((arrFile) => {
      this.uploadFile(arrFile);
    });

    this.fileUploadControl.discardedValueChanges.subscribe(() => {
      this.toastInfo = {
        isShow: true,
        message: "Veuillez insérer une image jusqu'a 3 mo svp",
        type: allTypeToast.error,
      };
    });

    this.httpService.getEventFilteredByParams('is_validate', false).subscribe({
      next: (res: any) => {
        this.arrayEventNotValidate = res.body;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });

    this.httpService.getEventFilteredByParams('is_validate', true).subscribe({
      next: (res: any) => {
        this.arrayEventValidate = res.body;
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      }
    })
  }

  validate = (id: string) => {
    this.httpService.validateEvent(id).subscribe({
      next: (res: any) => {
        const element = document.getElementById(id);
        element?.remove();
        if(element){ 
          document.getElementById("eventValidate")?.appendChild(element);
        }
      },
      error: (err): any => {
        this.responseService.ErrorF(err);
      },
    });
  };

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
    }
  };
}
