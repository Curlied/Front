import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent implements OnInit {
  currentDate = new Date().toISOString().slice(0, 10);

  
  profileForm = new FormGroup({
    username: new FormControl('' ,[Validators.required, Validators.minLength(6)]),
    email: new FormControl('' ,[Validators.required]),
    password: new FormControl('' ,[Validators.required, Validators.minLength(3)]),
    confirm_password: new FormControl('',[Validators.required, Validators.minLength(3)]),
    birth_date: new FormControl('',[Validators.required]),
    telephone: new FormControl('',[Validators.required]),
    url_image:  new FormControl()
  });

  constructor(private httpService : HttpService,private responseService : ResponseService) { }

  ngOnInit(): void {
  }

  register(){

    let formData = new FormData();
    formData.append('username',this.profileForm.get('username')?.value);
    formData.append('email',this.profileForm.get('email')?.value);
    formData.append('password',this.profileForm.get('password')?.value);
    formData.append('confirm_password',this.profileForm.get('confirm_password')?.value);
    formData.append('birth_date',this.profileForm.get('birth_date')?.value);
    formData.append('telephone',this.profileForm.get('telephone')?.value);

    let image =this.profileForm.get('url_image')?.value;
    if(image)
      formData.append('url_image',image,image.name);
        
    this.httpService.postRegister(formData).subscribe({

      next :(res: any ) => { 
        this.responseService.SuccessF(res);
      },

      error : (err: any)=> { 
        this.responseService.ErrorF(err);
      }
    })
  }

  uploadFile(event :any) {
    const file = (event.target).files[0];
    this.profileForm.patchValue({
      url_image: file
    });
  }
}
