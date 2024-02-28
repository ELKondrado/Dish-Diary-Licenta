import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { MessageService } from '../../Models/Message/message.service';
import { Message } from '../../Models/Message/message';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})
export class UserChatComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public conversations: Message[] | undefined;
  public notifications: Notif[] | undefined;
  public friendRequestNotification: Notif | undefined;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;

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
      this.getMessagesForUser();
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

  public toggleMenu(){
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public getMessagesForUser(): void {
    if(this.user){
      this.messageService.getMessages(this.user.userId).subscribe(
        (conversations: Message[]) => {
          this.conversations = conversations;
          this.fetchChatUserProfiles();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR getting the messages :" + error);
        }
      )
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
          console.log(notifications);
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
