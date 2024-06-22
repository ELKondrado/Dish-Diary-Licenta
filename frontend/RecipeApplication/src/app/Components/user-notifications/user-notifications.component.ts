import { Component } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { FriendsService } from '../../Models/Friendship/friends.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrl: './user-notifications.component.css'
})
export class UserNotificationsComponent {
  constructor(
    private datePipe: DatePipe,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private friendsService: FriendsService,
    private router: Router,
  ) {}

  public user: User | null = null;
  public notifications: Notif[] = [];
  public friendRequests: Notif[] = [];
  public recipesShared: Notif[] = [];
  public friendRequestNotification: Notif | undefined;
  public avatarUrl: String | undefined;
  public addedRecipes: Recipe[] | undefined;

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.getNotifications();
   })
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

  public getNotifications(): void {
    if(this.user)
    {
      this.friendRequests = [];
      this.recipesShared = [];
      this.notificationService.getNotifications(this.user.userId).subscribe(
        (notifications: Notif[]) => {
          this.notifications = notifications;
          notifications.forEach(notification => {
            notification.sender.profileImage = 'data:image/jpeg;base64,' + notification.sender.profileImage;
          });
          this.notifications = notifications.filter(notification => notification.status === 'PENDING' || notification.status === 'SHARED');
          notifications.forEach(notification => {
            if(notification.type == 'FRIEND_REQUEST' && notification.status == 'PENDING') {
              this.friendRequests.push(notification);
            }
            if(notification.type == 'RECIPE_SHARE' && notification.status == 'SHARED') {
              notification.sharedRecipe.image = 'data:image/jpeg;base64,' + notification.sharedRecipe.image;
              this.recipesShared.push(notification);
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  public acceptFriendRequest(notification: Notif): void {
    if(notification){
      this.friendsService.acceptFriendRequest(notification.id).subscribe(
        (response: any) => {
          this.getNotifications();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public rejectFriendRequest(notification: Notif): void {
    if(notification){
      this.friendsService.rejectFriendRequest(notification.id).subscribe(
        (response: any) => {
          
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public rejectRecipeShare(recipeShared: Notif) {
    if(recipeShared){
      this.notificationService.rejectRecipeShare(recipeShared.id).subscribe(
        (response: any) => {
          this.getNotifications();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public acceptRecipeShare(recipeShared: Notif) {
    if(recipeShared){
      this.notificationService.acceptRecipeShare(recipeShared.id).subscribe(
        (response: any) => {
          this.onOpenRecipe(recipeShared.sharedRecipe);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public formattedDate(date: string): string | null{
    return this.datePipe.transform(date, 'M/d/yyyy HH:mm');
  }

  public onOpenFriendProfile(friendNickname: String): void {
    this.router.navigate([`/profile/${friendNickname}`]);
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/recipe/${recipe.id}`]);
  }
}
