import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ToastComponent } from './toasts/toast.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { ListeEvenementsComponent } from './evenement/liste-evenements/liste-evenements.component';
import { DetailsEvenementComponent } from './evenement/details-evenement/details-evenement.component';
import { CreationEvenementComponent } from './evenement/creation-evenement/creation-evenement.component';
import { ProfilComponent } from './espace-utilisateur/profil/profil.component';
import { MessagesComponent } from './espace-utilisateur/messages/messages.component';
import { AdminComponent } from './admin/admin.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'toasts', component: ToastComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'evenements', component: ListeEvenementsComponent },
  { path: 'detailsEvenement', component: DetailsEvenementComponent },
  { path: 'creationEvenement', component: CreationEvenementComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'administration', component: AdminComponent },
  { path: 'confirm', component: ConfirmationComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
