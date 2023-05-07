import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TalkjsService } from 'src/app/talkjs.service';
import Talk from 'talkjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  private inbox!: Talk.Inbox;
  private session!: Talk.Session;
  private otherUsers!: any;
  @ViewChild('talkjsContainer') talkjsContainer!: ElementRef;

  constructor(
    private talkService: TalkjsService,
    private jwt: JwtHelperService,
    private route: ActivatedRoute,
    private httpService: HttpService
  ) {}

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    this.route.queryParams.subscribe(async (params) => {
      const isGroup = params['isGroup'];
      if (isGroup == 'false') {
        const otherUser = {
          id: params['user'],
          username: params['name'],
          email: params['name'],
          welcomeMessage: 'Hey there! How are you? :-)',
          role: 'default',
        };
        this.createInboxUser(otherUser);
      } else if (isGroup == 'true') {
        const event: any = await this.getDetailsEvent(params['group']);
        if (event) {
          const evendBody = event.body;
          this.otherUsers = [
            {
              id: evendBody.creator._id,
              username: evendBody.creator.username,
              email: evendBody.creator.username,
              welcomeMessage: 'Hey there! How are you? :-)',
              role: 'default',
            },
            ...evendBody.users_valide.map((user: any) => {
              return {
                id: user._id,
                username: user.username,
                email: user.username,
                welcomeMessage: 'Hey there! How are you? :-)',
                role: 'default',
              };
            }),
          ];
          this.createInboxGroup(params['group'], evendBody.name);
        } else {
          this.createInboxUser({
            id: decodedToken.userId + 'userNotFound',
            username: 'Aucun groupe trouvé',
          });
        }
      } else {
        this.createInboxUser({
          id: decodedToken.userId + 'userNotFound',
          username: 'Aucun utilisateur trouvé',
        });
      }
    });
    this.talkService.obsHaveUnreadMessages.next(false);
  }

  private async createInboxUser(otherUser: any) {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    const user = {
      id: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
      welcomeMessage: 'Hey there! How are you? :-)',
      role: 'default',
    };
    const session = await this.talkService.createCurrentSession(user);
    this.inbox = await this.talkService.createInbox(session, otherUser);
    this.inbox.mount(this.talkjsContainer.nativeElement);
  }

  private async createInboxGroup(idGroup: string, nameGroup: string) {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    const user = {
      id: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
      welcomeMessage: 'Hey there! How are you? :-)',
      role: 'default',
    };
    const session = await this.talkService.createCurrentSession(user);
    this.inbox = await this.talkService.createInbox(
      session,
      this.otherUsers,
      idGroup,
      nameGroup
    );
    this.inbox.mount(this.talkjsContainer.nativeElement);
  }

  getDetailsEvent = async (event_id: any) => {
    return this.httpService.getDetailsEventById(event_id).toPromise();
  };
}
