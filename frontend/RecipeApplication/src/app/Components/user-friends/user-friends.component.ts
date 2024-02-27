import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrl: './user-friends.component.css'
})
export class UserFriendsComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
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

