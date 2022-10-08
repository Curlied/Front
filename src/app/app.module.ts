import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './toasts/toast.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { HeaderComponent } from './template/header/header.component';
import { FooterComponent } from './template/footer/footer.component';
import { ListeEvenementsComponent } from './evenement/liste-evenements/liste-evenements.component';
import { DetailsEvenementComponent } from './evenement/details-evenement/details-evenement.component';
import { CreationEvenementComponent } from './evenement/creation-evenement/creation-evenement.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { ErrorComponent } from './error/error.component';
import { EspaceUtilisateurComponent } from './espace-utilisateur/espace-utilisateur.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CookieService } from 'ngx-cookie-service';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ToastComponent,
    ConnexionComponent,
    InscriptionComponent,
    HeaderComponent,
    FooterComponent,
    ListeEvenementsComponent,
    DetailsEvenementComponent,
    CreationEvenementComponent,
    ConfirmationComponent,
    ErrorComponent,
    EspaceUtilisateurComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FileUploadModule,
    BrowserAnimationsModule 
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
