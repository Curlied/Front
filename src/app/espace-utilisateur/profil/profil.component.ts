import { Component, OnInit } from '@angular/core';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseService } from '../../response.service';
import { HttpService } from '../../http.service';
import { formatDate } from '@angular/common';
import { AnyARecord } from 'dns';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  global_bucket_images =
    environment.bucketImagesBasePath + environment.folderBucketEventPictures;

  public animation: boolean = false;
  public multiple: boolean = true;
  arrayFile!: any[];


  profilData: any;
  personalInfoData: any;
  allEventsData: any;
  personalDescriptionData: string | undefined;

  //#region VARIABLE FOR MODAL
  dataModalCancelMyEvent : any;
  dataModalCancelParticipationEvent : any;
  arrayUserValidateParticipateSpaceUser: any;
  arrayUserPendingParticipateSpaceUser: any;
  arrayUserRefuseParticipateSpaceUser: any;
  //#endregion

  //https://pivan.github.io/file-upload/
  public fileUploadControl = new FileUploadControl({ listVisible: true, accept: ['image/*'], discardInvalid: true, }, [FileUploadValidators.filesLimit(3), FileUploadValidators.accept(["image/*"]), FileUploadValidators.fileSize(3000000)]);
  editInfoForm = new UntypedFormGroup({
    url_image: new UntypedFormControl(),
    username: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
    birth_date: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    telephone: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    aboutMe: new UntypedFormControl('', [Validators.required])
  });

  editPasswordForm = new UntypedFormGroup({
    old_password: new UntypedFormControl('', [Validators.required]),
    new_password: new UntypedFormControl('', [Validators.required]),
    confirm_new_password: new UntypedFormControl('', [Validators.required]),
  });


  constructor(private responseService: ResponseService, private httpService: HttpService, private router: Router) {
    this.myProfil();
    this.personnalInformations();
    this.myEvents();
  }


  ngOnInit(): void {
    this.setup();
  }


  /** Fetch username, age, and all event resume created 
   * */ 
  myProfil() {
    this.clearData();

    this.httpService.getMyProfilUsersForSpace().subscribe({
      next: (res: any) => {
        this.profilData = res.body;
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });
  }


  /** Fetch information by account user
   **/
  personnalInformations() {
    this.clearData();

    this.httpService.getPersonalInformationsForUsersSpace().subscribe({
      next: (res: any) => {
        this.personalInfoData = res.body;

        this.editInfoForm.controls['username'].setValue(this.personalInfoData.username);
        this.editInfoForm.controls['email'].setValue(this.personalInfoData.email);
        this.editInfoForm.controls['birth_date'].setValue(formatDate(this.personalInfoData.birthdate,'yyyy-MM-dd','en'));
        this.editInfoForm.controls['telephone'].setValue(this.personalInfoData.telephone);
        this.editInfoForm.controls['aboutMe'].setValue('yo');
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });

    this.httpService.getMyProfilUsersForSpace().subscribe({
      next: (res: any) => {
        this.personalDescriptionData = res.body.description;
        this.editInfoForm.controls['aboutMe'].setValue(this.personalDescriptionData);
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });

  }


  /** Fetch and give power to manage event create and participate
   * @returns 
   */
  myEvents() {
    this.clearData();

    this.httpService.getAllEventsForUsersSpace().subscribe({
      next: (res: any) => {
        this.allEventsData = res.body;
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });
  }


  /** manage the input file picture on section personnal information 
   * 
   */
  setup() {
    this.arrayFile = [];
    this.fileUploadControl.valueChanges.subscribe((arrFile) => {
      this.uploadFile(arrFile);
    });

    this.fileUploadControl.discardedValueChanges.subscribe(() => {
      const error: HttpErrorResponse = new HttpErrorResponse({ error: { message: "Veuillez insérer une image jusqu'a 3 mo svp" }, status: 403 })
      this.responseService.ErrorF(error);
    });
  }


  /** Allow to manage file input
   * 
   * @param arrFile 
   */
  uploadFile = (arrFile: any[]) => {
    const nbFile = arrFile.length;
    if (nbFile == 0) {
      this.arrayFile = [];
    }
    else {
      for (let index = 0; index < nbFile; index++) {
        if (this.arrayFile.indexOf(arrFile[index]) === -1) {
          this.arrayFile.push(arrFile[index])
        }
        else {
          continue;
        }
      }
    }
  }


  modalCancelMyEvent(event :any){
    this.dataModalCancelMyEvent = event;
  }


  cancelMyEvent = (event_id: string) => {
    this.httpService.cancelMyEvent(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.myEvents();
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });
  }


  modalCancelParticpationEvent(event :any){
    this.dataModalCancelParticipationEvent = event;
  }


  /**
   * Allow to current user to cancel participation of event
   * @param event_id 
   */
  cancelParticipate = (event_id: string) => {
    this.httpService.cancelEventParticipation(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.myEvents();
      },
      error: (err: any) => {
        this.responseService.ErrorF(err);
      }
    });
  }


  /** Allow to complete modal value with user on my event create
   * 
   * @param arrayUsers 
   */
  completeModal(arrayUsers: any) {
    this.arrayUserValidateParticipateSpaceUser = arrayUsers.filter((us: any) => us.status.toLowerCase() == "validé");
    this.arrayUserPendingParticipateSpaceUser = arrayUsers.filter((us: any) => us.status.toLowerCase() == "en attente de validation");
    this.arrayUserRefuseParticipateSpaceUser = arrayUsers.filter((us: any) => us.status.toLowerCase() == "refusé");
  }

/** Clear data unused
 */
  clearData() {
    this.profilData = undefined;
    this.personalInfoData = undefined;
    this.allEventsData = undefined;
    this.arrayUserValidateParticipateSpaceUser = undefined;
    this.arrayUserPendingParticipateSpaceUser = undefined;
    this.arrayUserRefuseParticipateSpaceUser = undefined;
    this.personalDescriptionData = undefined;
  }

}
