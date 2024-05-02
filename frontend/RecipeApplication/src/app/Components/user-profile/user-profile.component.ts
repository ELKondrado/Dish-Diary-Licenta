import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Models/User/user';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { NotificationService } from '../../Models/Notification/notification.service';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../Models/Message/message.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public notificationsCount: number = 0;
  public unseenConversations: number = 0;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public repositoryRecipes: Recipe[] | undefined;
  public createdRecipes: Recipe[] | undefined;
  public addedRecipes: Recipe[] | undefined;
  public showEditProfile: boolean = false;
  public nicknameAlreadyUsed: boolean = false;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void{
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.getRepositoryRecipes();
      this.getCreatedRecipes()
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

  public toggleMenu(): void {
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public toggleProfileEdit(): void {
    this.showEditProfile = !this.showEditProfile;
  }

  public onEditProfile(editForm: NgForm): void {
    if(this.user && editForm){
      this.userService.updateUserAttributes(this.user.userId, editForm).subscribe(
        (response: any) => {
          console.log(response)
          if(response.status == "NICKNAME ALREADY USED"){
            this.nicknameAlreadyUsed = true;
          }
          else if(response.status == "SUCCESS"){
            this.nicknameAlreadyUsed = false;
            this.ngOnInit();
            this.toggleProfileEdit();
          }
        },
        (error: HttpErrorResponse) =>
        {
          console.error("ERROR editing profile attributes: " + error);
        }
      )
    }
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
        (error) => {
          console.error(error);
        }
      );
    }
  }

  public getRepositoryRecipes(): void {
    if(this.user)
    {
      this.recipeService.getUserRecipes(this.user?.userId).subscribe(
        (response: Recipe[]) => {
          this.repositoryRecipes = response;
          this.getAddedRecipes();
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
        }
      );
    }
  }

  public getCreatedRecipes() {
    if(this.user)
    {
      this.recipeService.getRecipesByOwner(this.user?.userName).subscribe(
        (createdRecipes: Recipe[]) => {
          this.createdRecipes = createdRecipes;
          this.getAddedRecipes();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR getting created recipes: " + error);
        }
      )
    }
  }
  
  public getAddedRecipes() {
    if (this.createdRecipes && this.repositoryRecipes) {
      const filteredRecipes = this.repositoryRecipes.filter(recipe1 =>
        !this.createdRecipes!.some(recipe2 => recipe1.id === recipe2.id)
      );
      this.addedRecipes = filteredRecipes;
    }
  }  
  
  public onOpenRecipesHistory(mode: string) {
    
    const container = document.getElementById("main-container");
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if(mode == 'total'){
      button.setAttribute('data-target', '#totalRecipesModal');
    }
    else if(mode == 'created'){
      button.setAttribute('data-target', '#createdRecipesModal');
    }
    else if(mode == 'added'){
      button.setAttribute('data-target', '#addedRecipesModal');
    }

    container?.appendChild(button);
    button.click();
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
          console.error('Error uploading profile image:', error);
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

  public mainPage(): void {
    this.router.navigate([`/${this.userService.getUsername()}/main`]);
  }

  public discoverRecipes(): void {
    this.router.navigate([`/${this.userService.getUsername()}/recipes`]);
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

  public logout(): void{   
    this.authService.logout();
  }
}
