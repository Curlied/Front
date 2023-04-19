import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private adresse = environment.AdresseAPI;
  private AdresseAuthentification = this.adresse + 'api/auth/';
  private AdresseEvent = this.adresse + 'api/events/';
  private AdresseEventFilter = this.adresse + 'api/events?filter=';
  private AdresseCategories = this.adresse + 'api/categories/';
  private AdresseUsers = this.adresse + 'api/users/';
  private AdressEventFiltered = this.adresse + 'api/events/filtered?filter=';
  private http: HttpClient;
  private urlInfos = this.adresse;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };
  httpOptionsFormData = {
    withCredentials: true,
  };

  constructor(http: HttpClient) {
    this.http = http;
  }

  getPing() {
    return this.http.get(this.urlInfos);
  }

  //#region AUTH
  private urlRegister = this.AdresseAuthentification + 'register';
  private urlConfirmation = this.AdresseAuthentification + 'confirm';
  private urlLogin = this.AdresseAuthentification + 'login';
  private urldisconnect = this.AdresseAuthentification + 'disconnect';

  postRegister(data: any) {
    return this.http.post(this.urlRegister, data);
  }
  getConfirmation(data: any) {
    let params = new HttpParams().set('key', data);
    return this.http.put(this.urlConfirmation, { params: params });
  }

  postLogin(data: any) {
    return this.http.post(this.urlLogin, data, this.httpOptions);
  }
  postDisconnect() {
    return this.http.get(this.urldisconnect, this.httpOptions);
  }
  //#endregion

  //#region EVENT

  private urlSubmitParticipation = this.AdresseEvent + 'join/';
  private urlCancelParticipation = this.AdresseEvent + 'leave/';
  private urlSearchEvent = this.AdresseEvent + 'search/';

  postAddEvent(data: any) {
    return this.http.post(this.AdresseEvent, data, this.httpOptionsFormData);
  }

  getAllEvent() {
    return this.http.get(this.AdresseEvent);
  }

  getEventByParams(nameOfPropertyFilter: any, dataSearch: any) {
    let adressWithFilter = `${this.AdresseEventFilter}${nameOfPropertyFilter}=${dataSearch}`;
    return this.http.get(adressWithFilter, this.httpOptions);
  }

  getEventFilteredByParams(nameOfPropertyFilter: any, dataSearch: any) {
    let adressWithFilter = `${this.AdressEventFiltered}${nameOfPropertyFilter}=${dataSearch}`;
    console.log(adressWithFilter);
    return this.http.get(adressWithFilter, this.httpOptions);
  }

  getDetailsEventById(_id: string) {
    return this.http.get(this.AdresseEvent + _id, this.httpOptions);
  }

  putSubmitParticipation(_eventId: string) {
    return this.http.put(
      this.urlSubmitParticipation + _eventId,
      this.httpOptions
    );
  }

  cancelEventParticipation(_eventId: string) {
    return this.http.put(
      this.urlCancelParticipation + _eventId,
      this.httpOptions
    );
  }

  acceptUserEvent(_eventId: string, _userId: string) {
    return this.http.put(
      this.AdresseEvent + _eventId + '/users/' + _userId + '/confirm',
      this.httpOptions
    );
  }

  cancelMyEvent(_eventId: string) {
    return this.http.delete(this.AdresseEvent + _eventId, this.httpOptions);
  }

  postSearchEventAllEventPage(data: any) {
    return this.http.post(this.urlSearchEvent, data, this.httpOptions);
  }

  validateEvent(_eventId: String) {
    console.log(`${this.AdresseEvent}${_eventId}/validate`);
    return this.http.get(
      `${this.AdresseEvent}${_eventId}/validate`,
      this.httpOptions
    );
  }
  //#endregion

  //#region CATEGORIES
  getAllCategories() {
    return this.http.get(this.AdresseCategories);
  }

  getCategoryByid(id: string) {
    return this.http.get(this.AdresseCategories + id);
  }
  //#endregion

  //#region USER
  urlRoles = this.AdresseUsers + 'roles';

  getMyProfilUsersForSpace() {
    return this.http.get(this.AdresseUsers + 'profils', this.httpOptions);
  }

  getPersonalInformationsForUsersSpace() {
    return this.http.get(this.AdresseUsers + 'infos', this.httpOptions);
  }

  getAllEventsForUsersSpace() {
    return this.http.get(this.AdresseUsers + 'events', this.httpOptions);
  }

  getRoles() {
    return this.http.get(this.urlRoles, this.httpOptions);
  }
  //#endregion

  //#region API GOUV
  private urlGetDepartementOnRegionRhone =
    'https://geo.api.gouv.fr/regions/84/departements?fields=nom,code';
  getDepartementOnRegion() {
    return this.http.get(this.urlGetDepartementOnRegionRhone);
  }
  getCommuneByDepartmentCode(id_commune: any) {
    return this.http.get(
      `https://geo.api.gouv.fr/departements/${id_commune}/communes?fields=codesPostaux&format=json&geometry=centre`
    );
  }
  //#endregion
}
