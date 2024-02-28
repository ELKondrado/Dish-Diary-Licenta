import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { MessageService } from '../../Models/Message/message.service';
import { Message } from '../../Models/Message/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})
export class UserChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {}
  public user: User | null = null;
  public username: string | undefined;
  public conversations: Message[] = [];
  public notifications: Notif[] = [];
  public friendRequestNotification: Notif | undefined;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public friendCurrentConversation: User | undefined;
  public activeConversationIndex: number | null = null;
  public messagesFromFriend: Message[] = [];
  public messageToSend: string = "";
  public previousMessageTimestamp: string | null = null;
  public showDateBubbles: boolean[] = [];

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void{
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.getProfileImage();
      this.getNotifications();
      this.getMessages();
    });
  }

  private fetchUser(): void {
    const dropdown = document.querySelector(".dropdown");
    const avatar = dropdown?.querySelector(".lil-avatar");
    const menu = dropdown?.querySelector(".menu");
  
    avatar?.addEventListener('click', () => {
      menu?.classList.toggle('menu-open');
    });
  }

  public toggleMenu(): void {
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public shouldShowDate(message: Message, currentIndex: number): boolean {
    if (currentIndex === 0) {
      return true; 
    }
    const currentMessageDate = this.formattedDateDDMMYYYY(message.timestamp.toString());
    const previousMessageDate = this.formattedDateDDMMYYYY(this.messagesFromFriend[currentIndex - 1].timestamp.toString());
  
    return currentMessageDate !== previousMessageDate;
  }

  public changeCurrentFriendConversation(conversation: Message, index: number): void {
    if(conversation.receiver.userId != this.user?.userId){
      this.friendCurrentConversation = conversation.receiver;
      this.activeConversationIndex = index;
      this.getMessagesFromUser();
    }
    else{
      this.friendCurrentConversation = conversation.sender;
      this.activeConversationIndex = index;
      this.getMessagesFromUser();
    }
  }

  public getMessages(): void {
    if (this.user) {
        this.messageService.getMessages(this.user.userId).subscribe(
            (conversations: Message[]) => {
              this.conversations = conversations;
              this.conversations.sort((a, b) => {
                const timestampA = new Date(a.timestamp);
                const timestampB = new Date(b.timestamp);
            
                return timestampB.getTime() - timestampA.getTime();
              });
              this.conversations = this.removeDuplicateMessages(this.conversations)
              this.fetchChatUserProfiles();
              this.changeCurrentFriendConversation(this.conversations[0], 0);
            },
            (error: HttpErrorResponse) => {
                console.error("ERROR getting the messages :" + error);
            }
        );
    }
  }

  private removeDuplicateMessages(messages: Message[]) {
      const uniqueCombinations = new Set<string>();
      const uniqueMessages: Message[] = [];

      messages.forEach(message => {
          const combination1 = `${message.sender.userId}-${message.receiver.userId}`;
          const combination2 = `${message.receiver.userId}-${message.sender.userId}`;

          if (!uniqueCombinations.has(combination1) && !uniqueCombinations.has(combination2)) {
              uniqueCombinations.add(combination1);
              uniqueCombinations.add(combination2);
              uniqueMessages.push(message);
          }
      });

      return uniqueMessages;
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
          this.scrollToBottom();
          this.showDateBubbles = new Array(this.messagesFromFriend.length).fill(false);
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR getting the messages :" + error);
        }
      );
    }
  }

  private scrollToBottom() {
    const chatMessagesContainer = this.scrollContainer.nativeElement;
    if (chatMessagesContainer) {
      setTimeout(() => {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      });
    }
  }

  public sendMessage(): void {
    if(this.user && this.friendCurrentConversation && this.messageToSend.trim().length != 0){
      this.messageService.sendMessage(this.user?.userId, this.friendCurrentConversation?.userId, this.messageToSend).subscribe(
        (response: any) => {
          console.log(response);
          this.getMessages();
          this.getMessagesFromUser();
          this.messageToSend = "";
          this.resetTextareaHeight();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR sending the message: " + error); 
        }
      );
    }
  }

  public searchConversation(key: string): void {
    const resultConversations: Message[] = [];
    for (const conversation of this.conversations) {
      if(conversation.receiver.userId != this.user?.userId) {
        if(conversation.receiver.userNickname.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        resultConversations.push(conversation);
        }
      }
      else if(conversation.sender.userId != this.user?.userId) {
        if(conversation.sender.userNickname.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        resultConversations.push(conversation);
        }
      }
    } 
    this.conversations = resultConversations;
    if (resultConversations.length === 0 || !key){
      this.getMessages();
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

  public fetchChatUserProfiles() {
    if(this.conversations){
      this.conversations.forEach(conversation => {
        conversation.sender.profileImage = 'data:image/jpeg;base64,' + conversation.sender?.profileImage;
        conversation.receiver.profileImage = 'data:image/jpeg;base64,' + conversation.receiver?.profileImage;
      });
    }
  }

  public getNotifications(): void {
    if(this.user){
      this.notificationService.getNotifications(this.user.userId).subscribe(
        (notifications: Notif[]) => {
          notifications.forEach(notification => {
            notification.sender.profileImage = 'data:image/jpeg;base64,' + notification.sender.profileImage;
          });
          this.notifications = notifications.filter(notification => notification.status === 'PENDING');
        },
        (error) => {
          console.error("ERROR getting the notifications: " + error);
        }
      );
    }
  }

  public onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if(this.selectedFile)
      {
          reader.readAsDataURL(this.selectedFile);
          reader.onload = (eventReader: any) => {
          this.avatarUrl = eventReader.target.result;
          this.uploadImage();
        };
      }
    }
  }
  
  public uploadImage() {
    if (this.user?.userId && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
  
      this.userService.uploadProfileImage(this.user.userId, formData).subscribe(
        () => {
          this.getProfileImage();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR uploading profile image: ", error);
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

  public onOpenFriendProfile(friendUsername: String): void {
    this.router.navigate([`/${this.userService.getUsername()}/friend-profile/${friendUsername}`]);
  }

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/main`]);
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
  }

  public userFriends(): void {
    this.router.navigate([`/${this.userService.getUsername()}/friends`]);
  }

  public userNotifications(): void {
    this.router.navigate([`/${this.userService.getUsername()}/notifications`]);
  }

  public logout(): void{   
    this.authService.logout();
  }
}
