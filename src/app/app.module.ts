import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastComponent } from './toasts/toast.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { HeaderComponent } from './template/header/header.component';
import { FooterComponent } from './template/footer/footer.component';
import { DetailsEvenementComponent } from './evenement/details-evenement/details-evenement.component';
import { CreationEvenementComponent } from './evenement/creation-evenement/creation-evenement.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { ErrorComponent } from './error/error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { CookieService } from 'ngx-cookie-service';
import { AdminComponent } from './admin/admin.component';
import { ProfilComponent } from './espace-utilisateur/profil/profil.component';
import { MessagesComponent } from './espace-utilisateur/messages/messages.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './auth.interceptor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgOptimizedImage } from '@angular/common';
import { SvgComponent } from './components/svg/svg.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AlertPwaComponent } from './alert-pwa/alert-pwa.component';
import { ModalComponent } from './components/modal/modal.component';
import { ImageLoadedDirective } from './image-loaded.directive';
import { IsProdDirective } from './directive/is-prod.directive';
import { MentionLegalComponent } from './mention-legal/mention-legal.component';
import { SitemapComponent } from './sitemap/sitemap.component';

export function tokenGetter() {
  return localStorage.getItem('token') ? localStorage.getItem('token') : '';
}

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    ToastComponent,
    ConnexionComponent,
    InscriptionComponent,
    HeaderComponent,
    FooterComponent,
    DetailsEvenementComponent,
    CreationEvenementComponent,
    ConfirmationComponent,
    ErrorComponent,
    ProfilComponent,
    MessagesComponent,
    AdminComponent,
    SvgComponent,
    AlertPwaComponent,
    ModalComponent,
    ImageLoadedDirective,
    IsProdDirective,
    MentionLegalComponent,
    SitemapComponent,
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   // Register the ServiceWorker as soon as the application is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerImmediately',
    // }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CookieService,
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
