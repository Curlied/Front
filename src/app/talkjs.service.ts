import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import Talk from 'talkjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TalkjsService {
  private currentUser!: Talk.User;
  public haveUnreadMessages: boolean = false;
  constructor(private jwt: JwtHelperService, private http: HttpClient) {}

  async createUser(applicationUser: any) {
    await Talk.ready;
    return new Talk.User({
      id: applicationUser.id,
      name: applicationUser.username,
      photoUrl: applicationUser.photoUrl,
      role: applicationUser.role,
    });
  }

  async createCurrentSession(userConnected: any) {
    await Talk.ready;
    this.currentUser = await this.createUser(userConnected);
    const session = new Talk.Session({
      appId: 't3a4xneH',
      me: this.currentUser,
    });
    return session;
  }

  private async getOrCreateConversation(
    session: Talk.Session,
    otherApplicationUser: any
  ) {
    const otherUser = await this.createUser(otherApplicationUser);
    const conversation = session.getOrCreateConversation(
      Talk.oneOnOneId(this.currentUser, otherUser)
    );
    conversation.setParticipant(this.currentUser);
    conversation.setParticipant(otherUser);
    return conversation;
  }

  private async getOrCreateConversationGroup(
    session: Talk.Session,
    otherApplicationUser: any,
    groupId: string,
    name: string = ''
  ) {
    const conversation = session.getOrCreateConversation(groupId);
    for (const user of otherApplicationUser) {
      const otherUser = await this.createUser(user);
      conversation.setParticipant(otherUser);
    }
    if (name !== '') {
      conversation.subject = name;
    }
    return conversation;
  }

  async createInbox(
    session: Talk.Session,
    otherApplicationUser: any,
    groupId: string = '',
    name: string = ''
  ) {
    let conversation: any;
    let inbox: any;
    if (groupId !== '') {
      conversation = await this.getOrCreateConversationGroup(
        session,
        otherApplicationUser,
        groupId,
        name
      );
      inbox = session.createInbox({ selected: conversation.id });
    } else {
      conversation = await this.getOrCreateConversation(
        session,
        otherApplicationUser
      );
      inbox = session.createInbox();
    }
    if (
      groupId == '' &&
      otherApplicationUser.username == 'Aucun utilisateur trouvé'
    ) {
      inbox.select();
    } else {
      inbox.select(conversation);
    }

    return inbox;
  }

  async haveMessage() {
    const token = localStorage.getItem('token') || '';
    const decodedToken = this.jwt.decodeToken(token);
    const user = {
      id: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
      welcomeMessage: 'Hey there! How are you? :-)',
      role: 'default',
    };
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer sk_test_VfPoBaCcKJSvcpqkKAfCCnneXKh7nLOb`
    );
    const conversations: any = await this.http
      .get(
        `https://api.talkjs.com/v1/t3a4xneH/users/${user.id}/conversations?hasUnread=true`,
        { headers }
      )
      .toPromise();
    let haveUnread = false;
    for (const conversation of conversations.data) {
      const lastMessage = conversation.lastMessage;
      if (lastMessage === null) continue;
      if (lastMessage.senderId !== user.id) {
        if (!lastMessage.readBy.includes(user.id)) {
          haveUnread = true;
        }
      }
    }
    this.haveUnreadMessages = haveUnread;
    return haveUnread;
  }

  // Avec talkjs sur angular je voudrais savoir si l'utilisateur a un message non lus sur l'une de ses conversations
}
