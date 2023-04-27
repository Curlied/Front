import { Injectable } from '@angular/core';
import Talk from 'talkjs';
@Injectable({
  providedIn: 'root',
})
export class TalkjsService {
  private currentUser!: Talk.User;
  constructor() {}

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
}
