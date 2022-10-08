import { Component, OnInit } from '@angular/core';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseService } from '../response.service';
import { HttpService } from '../http.service';
import { formatDate } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-espace-utilisateur',
  templateUrl: './espace-utilisateur.component.html',
  styleUrls: ['./espace-utilisateur.component.css']
})
export class EspaceUtilisateurComponent implements OnInit {

  public animation: boolean = false;
  public multiple: boolean = true;
  arrayFile!: any[];


  profilData: any;
  personalInfoData: any;
  allEventsData: any;

  sectionSelect!: string;

//#region VARIABLE FOR MODAL
  dataModalCancelMyEvent : any;
  dataModalCancelParticipationEvent : any;
  arrayUserValidateParticipateSpaceUser: any;
  arrayUserPendingParticipateSpaceUser: any;
  arrayUserRefuseParticipateSpaceUser: any;
//#endregion

  //https://pivan.github.io/file-upload/
  public fileUploadControl = new FileUploadControl({ listVisible: true, accept: ['image/*'], discardInvalid: true, }, [FileUploadValidators.filesLimit(3), FileUploadValidators.accept(["image/*"]), FileUploadValidators.fileSize(3000000)]);
  eventForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    birth_date: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.minLength(3)]),
    telephone: new FormControl('', [Validators.required, Validators.minLength(3)]),
    old_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    aboutMe: new FormControl('', [Validators.required]),
    url_image: new FormControl()
  });


  constructor(private responseService: ResponseService, private httpService: HttpService) {
    this.myProfil();
  }

  ngOnInit(): void {
    this.setup();
  }

  /** Fetch username, age, and all event resume created 
   * */ 
  myProfil() {
    if (this.sectionSelect == this.myProfil.name)
      return;
    this.sectionSelect = this.myProfil.name;
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
   * @returns 
   */
  personnalInformations() {
    if (this.sectionSelect == this.personnalInformations.name)
      return;
    this.sectionSelect = this.personnalInformations.name;
    this.clearData();

    this.httpService.getPersonalInformationsForUsersSpace().subscribe({
      next: (res: any) => {
        this.personalInfoData = res.body;
        this.eventForm.controls['username'].setValue(this.personalInfoData.username);
        this.eventForm.controls['email'].setValue(this.personalInfoData.email);
        this.eventForm.controls['birth_date'].setValue(formatDate(this.personalInfoData.birthdate,'yyyy-MM-dd','en'));
        this.eventForm.controls['telephone'].setValue(this.personalInfoData.telephone);
        this.eventForm.controls['aboutMe'].setValue(this.personalInfoData.description);
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
    if (this.sectionSelect == this.myEvents.name)
      return;
    this.sectionSelect = this.myEvents.name;
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
  };


  modalCancelMyEvent(event :any){
    this.dataModalCancelMyEvent = event;
  }

  cancelMyEvent = (event_id: string) => {
    this.httpService.cancelMyEvent(event_id).subscribe({
      next: (res: any) => {
        this.responseService.SuccessF(res);
        this.sectionSelect = '';
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
        this.sectionSelect = '';
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
  }

}
