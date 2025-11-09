import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conversation {
  id: number;
  clientName: string;
  clientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly API_URL = 'http://localhost:8082/api/conversations';

  constructor(private http: HttpClient) {}

  getAssistanteConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.API_URL}/assistante`);
  }

  getConversationMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_URL}/${conversationId}/messages`);
  }
}
