import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { NgForm } from '@angular/forms';
import { User } from '../../Models/User/user';
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { MessageService } from '../../Models/Message/message.service';

@Component({
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrl: './starter-page.component.css'
})
export class StarterPageComponent implements OnInit{
  constructor(
    private recipeService: RecipeService,
    private authService: AuthService, 
    private userService: UserService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public user: User | null = null;
  public recipes: Recipe[] = [];
  public notificationsCount: number = 0;
  public unseenConversations: number = 0;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;

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

  public getNotificationsCount(): void {
    if(this.user)
    {
      this.notificationService.getNotificationsCount(this.user.userId).subscribe(
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

  // change in searchUser
  public searchRecipe(key: string): void {
    const resultRecipes: Recipe[] = [];
    for (const recipe of this.recipes) {
      if (recipe.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        resultRecipes.push(recipe);
      }
    }
    this.recipes = resultRecipes;
    if (resultRecipes.length === 0 || !key){
      //this.getUserRecipes();
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

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
  }

  public onOpenRecipe(recipe: Recipe): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipe/${recipe.id}`]);
  }

  public userProfile(): void {
    this.router.navigate([`/${this.userService.getUsername()}/profile`]);
  }

  public userFriends(): void {
    this.router.navigate([`/${this.userService.getUsername()}/friends`]);
  }

  public userChat(): void {
    this.router.navigate([`/${this.userService.getUsername()}/chat`]);
  }

  public userNotifications(): void {
    this.router.navigate([`/${this.userService.getUsername()}/notifications`]);
  }
 
  public logout(): void {   
    this.authService.logout();
  }
}
