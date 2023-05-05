import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ToastComponent } from './toasts/toast.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { DetailsEvenementComponent } from './evenement/details-evenement/details-evenement.component';
import { CreationEvenementComponent } from './evenement/creation-evenement/creation-evenement.component';
import { ProfilComponent } from './espace-utilisateur/profil/profil.component';
import { MessagesComponent } from './espace-utilisateur/messages/messages.component';
import { AdminComponent } from './admin/admin.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { ErrorComponent } from './error/error.component';
import { MentionLegalComponent } from './mention-legal/mention-legal.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'toasts', component: ToastComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  {
    path: 'detailsEvenement',
    component: DetailsEvenementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'creationEvenement',
    component: CreationEvenementComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  {
    path: 'administration',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  { path: 'confirm', component: ConfirmationComponent },
  { path: 'mention-legal', component: MentionLegalComponent },
  { path: 'sitemap', component: SitemapComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
