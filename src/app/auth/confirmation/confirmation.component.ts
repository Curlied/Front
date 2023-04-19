import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  global_bucket_images =
    environment.bucketImagesBasePath + environment.folderBucketGlobalPictures;

  ImageValue : string = 'information';
  MessageInformation : string = '...';

  constructor(private route: ActivatedRoute, private httpService : HttpService) {
    let keyConfirm ;
    this.route.queryParams.subscribe((params) => {
      let param: any = params;
      keyConfirm = param.key;
    });
    this.httpService.getConfirmation(keyConfirm).subscribe({
      next :(res: any ) => { 
        this.ImageValue = 'success';
        this.MessageInformation = res.message;
      },
      error : (err: any)=> { 
        this.ImageValue = 'error';
        this.MessageInformation = err.error.message;
      }
    })};

  ngOnInit(): void {

  }
}
