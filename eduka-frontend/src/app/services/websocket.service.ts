import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private messageSubject = new Subject<any>();
  message$ = this.messageSubject.asObservable();
  connect(): void {
    // TODO: Implement WebSocket connection and subscribe to topics
  }
  sendMessage(message: any): void {
    // TODO: Implement sending message via WebSocket
  }
  onMessage(message: any): void {
    this.messageSubject.next(message);
  }
}
