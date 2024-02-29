import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { FriendsService } from '../../Models/User/friends.service';
import { MessageService } from '../../Models/Message/message.service';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrl: './user-friends.component.css'
})
export class UserFriendsComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private friendsService: FriendsService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public friendToAdd: String = "";
  public friendRequestSent: boolean = false;
  public nicknameAddedNotFound: boolean = false;
  public friendRequestAlreadySent: boolean = false;
  public friendRequestAlreadyFriend: boolean = false;
  public friendRequestCannotAddYourself: boolean = false;
  public showFriendRequestForm: boolean = false;
  public notifications: Notif[] | undefined;
  public unseenConversations: number = 0;
  public avatarUrl: String | undefined;
  public friends: User[] | undefined;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void{
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      console.log(this.user)

      this.username = this.userService.getUsername();
      this.getFriends();
      this.getProfileImage();
      this.getNotifications();
      this.getUnseenConversations();
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

  public getFriends(): void {
    if(this.user)
    {
      this.userService.getFriends(this.user.userId).subscribe(
        (response: User[]) => {
          this.friends = response;
          this.friends.forEach(friend => {
            friend.profileImage = 'data:image/jpeg;base64,' + friend.profileImage;
          });
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log("ERROR getting user friends: ", error);
        }
      );
    }
  }

  public toggleFriendRequestForm() {
    this.showFriendRequestForm = !this.showFriendRequestForm;
  }

  public toggleMenu(){
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public getNotifications(): void {
    if(this.user)
    {
      this.notificationService.getNotifications(this.user.userId).subscribe(
        (notifications: Notif[]) => {
          console.log(notifications);
          notifications.forEach(notification => {
            notification.sender.profileImage = 'data:image/jpeg;base64,' + notification.sender.profileImage;
          });
          this.notifications = notifications.filter(notification => notification.status === 'PENDING');
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR getting the notifications: " + error);
        }
      );
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

  public onAddRecipeModal(): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addFriendModal');

    container?.appendChild(button);
    button.click();
  }

  public sendFriendRequest(): void {
    if(this.user){
      this.friendsService.sendFriendRequest(this.user.userId, this.friendToAdd.toString()).subscribe(
        (response: any) => {

          if(response.status == "SUCCESS"){
            this.friendRequestSent = true;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "USER RECEIVER NOT FOUND"){
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = true;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "FRIEND REQUEST ALREADY SENT"){
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = true;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "RECEIVER ALREADY FRIEND"){
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = true;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "CANNOT ADD YOURSELF"){
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = true;
          }

        },
        (error: HttpErrorResponse) => {
          console.error("ERROR: " + error);
        }
      );
    }
  }

  public getProfileImage(): void {
    if (this.user?.userId) {
      this.userService.getProfileImage(this.user.userId).subscribe(
        (data: any) => {
          this.avatarUrl = this.arrayBufferToBase64(data);
        },
        (error: HttpErrorResponse) => {
          console.error('Error getting profile image:', error);
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

  public onOpenFriendProfile(friendUsername: String): void {
    this.router.navigate([`/${this.userService.getUsername()}/friend-profile/${friendUsername}`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
  }

  public userChat(): void {
    this.router.navigate([`/${this.userService.getUsername()}/chat`]);
  }

  public userNotifications(): void {
    this.router.navigate([`/${this.userService.getUsername()}/notifications`]);
  }
 
  public logout(): void{   
    this.authService.logout();
  }
}
