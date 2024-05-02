import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket = new SockJS('http://localhost:8080/dd-ws');;
  private stompClient = Stomp.over(this.socket);

  constructor() {
  }

  public subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if(connected){
      this.subscribeToTopic(topic, callback);
      return;
    }

    this.stompClient.connect({}, (): any =>{
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(topic: string, callback: any): void {
    this.stompClient.subscribe(topic, (): any =>{
      callback();
    });
  }
}
