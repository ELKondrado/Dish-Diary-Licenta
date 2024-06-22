import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { Notif } from '../../Models/Notification/notification';
import { MessageService } from '../../Models/Message/message.service';
import { Message } from '../../Models/Message/message';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { Conversation } from '../../Models/Conversation/conversation';
import { ConversationService } from '../../Models/Conversation/conversation.service';
import { WebSocketService } from '../../web-socket.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})
export class UserChatComponent implements OnInit, OnDestroy{
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private router: Router
  ) {
  }

  public user: User | null = null;
  public conversations: Conversation[] = [];
  public friendRequestNotification: Notif | undefined;
  public avatarUrl: String | undefined;
  public friendCurrentConversation: User | undefined;
  public activeConversationIndex: number | null = null;
  public messagesFromFriend: Message[] = [];
  public messageToSend: string = "";
  public previousMessageTimestamp: string | null = null;
  public showDateBubbles: boolean[] = [];
  public unseenConversations: number = 0;

  ngOnInit(): void {
    this.webSocketService.subscribe('/topic/message', (): void =>{
      this.getMessagesFromUser();
      this.setWasSeenConversation();
    });

    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.getProfileImage();
      this.getConversations();
      this.fetchFriendCurrentConversation();
    });

    if(this.conversations.length != 0)
      interval(1000)
      .pipe(take(10)) 
      .subscribe(() => {
        this.conversations.forEach(conversation => {
          conversation.lastMessage.timestamp = this.currentTimeDifferenceFormattedDate(conversation.lastMessage.timestamp.toString());
        });
      });
  }

  ngOnDestroy(): void {
  }

  public fetchFriendCurrentConversation(): void{
    this.route.params.subscribe((params) => {
      const friendUserName = params['friendUserName'];
      if(friendUserName)
      {
        this.userService.getUserDetails(friendUserName).subscribe(
        (friend: User) => {
          this.friendCurrentConversation = friend;
          this.friendCurrentConversation.profileImage = 'data:image/jpeg;base64,' + this.friendCurrentConversation.profileImage;
          this.getMessagesFromUser();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        });
      }
    });
  }

  public shouldShowDate(message: Message, currentIndex: number): boolean {
    if (currentIndex === 0) {
      return true; 
    }
    const currentMessageDate = this.formattedDateDDMMYYYY(message.timestamp.toString());
    const previousMessageDate = this.formattedDateDDMMYYYY(this.messagesFromFriend[currentIndex - 1].timestamp.toString());
  
    return currentMessageDate !== previousMessageDate;
  }

  public setWasSeenConversation(): void {
    if(this.user && this.friendCurrentConversation) {
      this.messageService.setWasSeenConversation(this.user?.userId, this.friendCurrentConversation.userId).subscribe(
        (response: any) => 
        {

        },
        (error : HttpErrorResponse) =>
        {
          console.error(error);
        });
    }
  }

  public changeCurrentFriendConversation(conversation: Conversation, index: number): void {
    if(this.user){
      if(conversation.user1.userId != this.user?.userId) {
        this.friendCurrentConversation = conversation.user1;
        this.activeConversationIndex = index;
        this.getMessagesFromUser();
        this.setWasSeenConversation();
        this.getConversations();
        this.getUnseenConversations()
      }
      else{
        this.friendCurrentConversation = conversation.user2;
        this.activeConversationIndex = index;
        this.getMessagesFromUser();
        this.messageService.setWasSeenConversation(this.user?.userId, this.friendCurrentConversation.userId).subscribe(
          (response: any) => {
          },
          (error : HttpErrorResponse) =>
          {
            console.error("ERROR setting the conversation to was seen: ");
            console.error(error)
          }
        );
        this.getConversations();
        this.getUnseenConversations()
      }
    }
  }

  public getConversations(): void {
    if (this.user) {
          this.conversationService.getConversations(this.user.userId).subscribe(
            (conversations: Conversation[]) => {
              this.conversations = conversations;
              this.conversations.sort((a, b) => {
                const timestampA = new Date(a.lastMessage.timestamp);
                const timestampB = new Date(b.lastMessage.timestamp);
            
                return timestampB.getTime() - timestampA.getTime();
              });
              this.fetchConversationUserProfiles();
            },
            (error: HttpErrorResponse) => {
                console.error(error);
            }
        );
      }
  }

  public getMessagesFromUser(): void {
    if(this.user && this.friendCurrentConversation){
      this.messageService.getMessagesFromUser(this.user.userId, this.friendCurrentConversation.userId).subscribe(
        (messagesFromFriend: Message[]) => {
          this.messagesFromFriend = messagesFromFriend;
          this.messagesFromFriend.sort((a, b) => {
            const timestampA = new Date(a.timestamp);
            const timestampB = new Date(b.timestamp);

            return timestampA.getTime() - timestampB.getTime();
          });
          this.scrollChatToBottom();
          this.showDateBubbles = new Array(this.messagesFromFriend.length).fill(false);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  private scrollChatToBottom() {
    const chatMessagesContainer = this.scrollContainer.nativeElement;
    if (chatMessagesContainer) {
      setTimeout(() => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      });
    }
  }

   public sendMessage(): void {
    if(this.user && this.friendCurrentConversation && this.messageToSend.trim().length != 0) {
      this.messageService.sendMessage(this.user?.userId, this.friendCurrentConversation?.userId, this.messageToSend).subscribe(
        (response: any) => {
          console.log(response);
          this.getConversations();
          this.getMessagesFromUser();
          this.messageToSend = "";
          this.resetTextareaHeight();
        },
        (error: HttpErrorResponse) => {
          console.error(error); 
        }
      );
    }
  }

  public searchConversation(key: string): void {
    const resultConversations: Conversation[] = [];
    for (const conversation of this.conversations) {
      if(conversation.user1.userId != this.user?.userId) {
        if(conversation.user1.userNickname.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          resultConversations.push(conversation);
        }
      }
      else if(conversation.user2.userId != this.user?.userId) {
        if(conversation.user2.userNickname.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        resultConversations.push(conversation);
        }
      }
    } 
    this.conversations = resultConversations;
    if (resultConversations.length === 0 || !key){
      this.getConversations();
    }
  }

  public auto_grow(event: any): void {
    const element = event.target as HTMLTextAreaElement;
    element.style.height = "10px";
    if((element.scrollHeight) < 355){
      element.style.height = (element.scrollHeight) + "px";
    }
    else {
      element.style.height = "355px";
      element.style.overflowY = "scroll";
    }
  }

  public resetTextareaHeight(): void {
    const textarea = document.getElementById('chat-box') as HTMLTextAreaElement;
    textarea.style.height = '5.7vh'; 
  }

  public fetchConversationUserProfiles() {
    if(this.conversations){
      this.conversations.forEach(conversation => {
        conversation.lastMessage.sender.profileImage = 'data:image/jpeg;base64,' + conversation.lastMessage.sender.profileImage;
        conversation.lastMessage.receiver.profileImage = 'data:image/jpeg;base64,' + conversation.lastMessage.receiver.profileImage;

        if(conversation.user1.userId == conversation.lastMessage.sender.userId) {
          conversation.user1.profileImage = conversation.lastMessage.sender.profileImage;
        }
        else if(conversation.user1.userId == conversation.lastMessage.receiver.userId) {
          conversation.user1.profileImage = conversation.lastMessage.receiver.profileImage;
        }

        if(conversation.user2.userId == conversation.lastMessage.sender.userId) {
          conversation.user2.profileImage = conversation.lastMessage.sender.profileImage;
        }
        else if(conversation.user2.userId == conversation.lastMessage.receiver.userId) {
          conversation.user2.profileImage = conversation.lastMessage.receiver.profileImage;
        }

      });
    }
  }

  public getUnseenConversations(): void {
    if(this.user){
      this.messageService.getUnseenConversations(this.user.userId).subscribe(
        (unseenConversations: number) => {
          this.unseenConversations = unseenConversations;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public getProfileImage() {
    if (this.user?.userId) {
      this.userService.getProfileImage(this.user.userId).subscribe(
        (data: any) => {
          this.avatarUrl = this.arrayBufferToBase64(data);
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR getting profile image: ", error);
        }
      );
    }
  }

  public arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = new Uint8Array(buffer);
    const bytes: string[] = [];

    binary.forEach((byte) => {
      bytes.push(String.fromCharCode(byte));
    });

    return 'data:image/jpeg;base64,' + btoa(bytes.join(''));
  }

  public formattedDateDDMMYYYY(date: string): string | null {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    return formattedDate || null;
  }

  public formattedDateHour(date: string): string | null{
    return this.datePipe.transform(date, 'HH:mm');
  }

  public formattedDate(date: string): string | null{
    return this.datePipe.transform(date, 'M/d/yyyy HH:mm');
  }

  public currentTimeDifferenceFormattedDate(date: string | null): string {
    if (!date) {
      return '';
    }
  
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
      return 'Invalid Date';
    }
  
    const now = new Date();
    const diffMs = now.getTime() - parsedDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor(diffMs / 1000);
  
    if (diffDays >= 1) {
      return `${diffDays}d`;
    } else if (diffHours >= 1) {
      return `${diffHours}h`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes}m`;
    } else
      return `now`;
  }

  public onOpenFriendProfile(friendNickname: String): void {
    this.router.navigate([`/profile/${friendNickname}`]);
  }
}
