import { Component } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { FriendsService } from '../../Models/User/friends.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrl: './user-notifications.component.css'
})
export class UserNotificationsComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private friendsService: FriendsService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public notifications: Notif[] | undefined;
  public friendRequestNotification: Notif | undefined;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public addedRecipes: Recipe[] | undefined;

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
      this.getProfileImage();
      this.getNotifications();
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

  public onResponseFriendRequestModal(friendRequestNotification: Notif | undefined, mode: string): void {

    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if( mode === 'accept') {
      this.friendRequestNotification = friendRequestNotification;
      button.setAttribute('data-target', '#acceptFriendRequestModal');
    }
    if( mode === 'reject') {
      this.friendRequestNotification = friendRequestNotification;
      button.setAttribute('data-target', '#rejectFriendRequestModal');
    }

    container?.appendChild(button);
    button.click();
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
        (error) => {
          console.error("ERROR getting the notifications: " + error);
        }
      );
    }
  }

  public acceptFriendRequest(notification: Notif): void {
    if(notification){
      this.friendsService.acceptFriendRequest(notification.id).subscribe(
        (response: any) => {
          console.log(response);
          this.getNotifications();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR accepting the friend request: " + error);
        }
      );
    }
  }

  public rejectFriendRequest(notification: Notif): void {
    if(notification){
      this.friendsService.rejectFriendRequest(notification.id).subscribe(
        (response: any) => {
          console.log(response);
          this.getNotifications();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR rejecting the friend request: " + error);
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

  public logout(): void{   
    this.authService.logout();
  }
}
