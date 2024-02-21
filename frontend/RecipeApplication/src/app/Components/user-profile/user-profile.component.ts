import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { UserDto } from '../../Models/User/userDto';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  public user: UserDto | null = null;
  public username: string | undefined;
  public recipe: Recipe | undefined;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;


  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  public fetchData(): void{
    this.authService.initializeApp().then(() => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.getProfileImage();
    });
  }

  private fetchUser(): void {
    const dropdown = document.querySelector(".dropdown");
    const avatar = dropdown?.querySelector(".lil-avatar");
    const menu = dropdown?.querySelector(".menu");
  
    avatar?.addEventListener('click', () => {
      console.log("MENU")

      menu?.classList.toggle('menu-open');
    });

    const image = document.querySelector('.profile-avatar') as HTMLImageElement;
    const imageContainer = document.querySelector('.profile-avatar-container') as HTMLElement;

    if (image && imageContainer) {
      image.addEventListener('load', () => {
        const containerWidth = imageContainer.offsetWidth;
        const aspectRatio = 1;

        const newWidth = containerWidth;
        const newHeight = containerWidth * aspectRatio;

        image.style.width = `${newWidth}px`;
        image.style.height = `${newHeight}px`;
        console.log( image.style.width)
        console.log( image.style.height)
      });
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

  public logout(): void{   
    this.authService.logout();
  }
}
