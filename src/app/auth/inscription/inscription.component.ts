import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/http.service';
import { ResponseService } from 'src/app/response.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent implements OnInit {
  currentDate = new Date().toISOString().slice(0, 10);

  
  profileForm = new UntypedFormGroup({
    username: new UntypedFormControl('' ,[Validators.required, Validators.minLength(6)]),
    email: new UntypedFormControl('' ,[Validators.required]),
    password: new UntypedFormControl('' ,[Validators.required, Validators.minLength(3)]),
    confirm_password: new UntypedFormControl('',[Validators.required, Validators.minLength(3)]),
    birth_date: new UntypedFormControl('',[Validators.required]),
    telephone: new UntypedFormControl('',[Validators.required]),
    url_image:  new UntypedFormControl()
  });

  constructor(private httpService : HttpService,private responseService : ResponseService, private metaService:Meta) { 
    this.addTags();
  }

  //ajout des tags
  addTags(){
    this.metaService.addTags([ 
      {name:'title', content:'page inscription'},
      { name: 'description', content: 'Page d/inscription'}, 
      { name: 'keywords', content: 'evenement lyon, ynov, solitude,login,connexion,inscription,register, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly'} 
  ]);
  }

  //permet d'afficher le rendu html des tags
  getTag(){
    this.metaService.addTag({name:'title', content:'page inscription'})
    this.metaService.addTag( { name: 'description', content: 'Page d/inscription'})
    this.metaService.addTag({ name: 'keywords', content: 'evenement lyon, ynov, solitude,login,connexion,inscription,register, meet up, social,ydays,event,curlied,curled,pas d amis, kurled,kurlyed,curlid,curlide,curly'})
  }


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
