import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from '../../Models/User/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../Models/User/user.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { RepositoryService } from '../../Models/Repository/repository.service';
import { Repository } from '../../Models/Repository/repository';

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
    private repositoryService: RepositoryService,
    private router: Router
  ) {}

  public user: User | null = null;
  public friend: User | undefined;
  public avatarUrl: String | undefined;
  public friendAvatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public repositoryRecipes: Recipe[] | undefined;
  public createdRecipes: Recipe[] | undefined;
  public addedRecipes: Recipe[] | undefined;
  public repositories: Repository[] = [];

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.fetchFriend();
      this.getProfileImage();
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
          this.getCreatedRecipes();
          this.getRepositories();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public getRepositoryRecipes(): void {
    console.log(this.friend)
    if(this.friend)
    {
      this.recipeService.getUserTotalRecipes(this.friend?.userId).subscribe(
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
      this.recipeService.getCreatedRecipes(this.friend?.userId).subscribe(
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
  
  public getRepositories(): void {
    if(this.friend){
      this.repositoryService.getRepositories(this.friend.userId).subscribe(
        ( response: Repository[]) => {
          console.log(response);
          this.repositories = response;
        },
        ( error: HttpErrorResponse) => {
          console.error(error);
        } 
      )
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

  public userChatFriend(friendUserName: string): void {
    this.router.navigate([`/${this.userService.getUsername()}/chat/${friendUserName}`]);
  }
}
