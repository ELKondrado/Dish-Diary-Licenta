import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Notification } from '../Models/Notification/notification';
import { User } from '../Models/User/user';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../Models/Notification/notification.service';
import { UserService } from '../Models/User/user.service';
import { AuthService } from '../Security/auth.service';
import { Recipe } from '../Models/Recipe/recipe';
import { RecipeService } from '../Models/Recipe/recipe.service';

@Component({
  selector: 'app-friend-user-profile',
  templateUrl: './friend-user-profile.component.html',
  styleUrl: './friend-user-profile.component.css'
})
export class FriendUserProfileComponent {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public friend: User | undefined;
  public notifications: Notification[] | undefined;
  public avatarUrl: String | undefined;
  public friendAvatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public repositoryRecipes: Recipe[] | undefined;
  public createdRecipes: Recipe[] | undefined;
  public addedRecipes: Recipe[] | undefined;

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  private fetchData(): void{
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.fetchFriend();
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

  public fetchFriend(): void{
    this.route.params.subscribe((params) => {
      const friendUserName = params['friendUserName'];
      this.userService.getUserDetails(friendUserName).subscribe(
        (friend: User) => {
          this.friend = friend;
          this.friend.profileImage = 'data:image/jpeg;base64,' + this.friend.profileImage;
          this.getRepositoryRecipes();
          this.getCreatedRecipes()
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public toggleMenu(){
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public getNotifications(): void {
    if(this.user)
    {
      this.notificationService.getNotifications(this.user.userId).subscribe(
        (notifications: Notification[]) => {
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

  public getRepositoryRecipes(): void {
    console.log(this.friend)
    if(this.friend)
    {
      this.recipeService.getUserRecipes(this.friend?.userId).subscribe(
        (response: Recipe[]) => {
          console.log(response)
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
    if(this.friend)
    {
      this.recipeService.getRecipesByOwner(this.friend?.userName).subscribe(
        (createdRecipes: Recipe[]) => {
          console.log(createdRecipes)
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
