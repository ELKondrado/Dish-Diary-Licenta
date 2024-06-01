import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { AuthService } from '../../Security/auth.service';
import { NotificationService } from '../../Models/Notification/notification.service';
import { MessageService } from '../../Models/Message/message.service';
import { User } from '../../Models/User/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  public user: User | null = null;
  public avatarUrl: String | undefined;
  public notificationsCount: number = 0;
  public unseenConversations: number = 0;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.getProfileImage();
      this.getNotificationsCount();
      this.getUnseenConversations();
    });
  }

  private fetchUser(): void {
    const dropdown = document.querySelector('.dropdown');
    const avatar = dropdown?.querySelector('.lil-avatar');
    const menu = dropdown?.querySelector('.menu');

    avatar?.addEventListener('click', () => {
      menu?.classList.toggle('menu-open');
    });
  }

  public toggleMenu(): void {
    let subMenu = document.getElementById('subMenu');
    subMenu?.classList.toggle('open-menu');
  }

  public getNotificationsCount(): void {
    if (this.user) {
      this.notificationService
        .getNotificationsCount(this.user.userId)
        .subscribe(
          (notifications: number) => {
            this.notificationsCount = notifications;
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  public getUnseenConversations(): void {
    if (this.user) {
      this.messageService.getUnseenConversations(this.user.userId).subscribe(
        (unseenConversations: number) => {
          this.unseenConversations = unseenConversations;
        },
        (error) => {
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

  public onOpenFriendProfile(friendNickname: String): void {
    this.router.navigate([`/${this.userService.getUsername()}/friend-profile/${friendNickname}`]);
  }

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/starter-page`]);
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
    this.toggleMenu();
  }

  public userFriends(): void {
    this.router.navigate([`/${this.userService.getUsername()}/friends`]);
    this.toggleMenu();
  }

  public userChat(): void {
    this.router.navigate([`/${this.userService.getUsername()}/chat`]);
    this.toggleMenu();
  }

  public userNotifications(): void {
    this.router.navigate([`/${this.userService.getUsername()}/notifications`]);
    this.toggleMenu();
  }

  public logout(): void {
    this.authService.logout();
  }
}
