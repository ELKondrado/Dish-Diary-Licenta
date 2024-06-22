import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../Models/User/user';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { NgForm } from '@angular/forms';
import { Repository } from '../../Models/Repository/repository';
import { RepositoryService } from '../../Models/Repository/repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FriendsService } from '../../Models/Friendship/friends.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private repositoryService: RepositoryService,
    private friendsService: FriendsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public user: User | null = null;
  public profileUser: User | null = null;
  public notificationsCount: number = 0;
  public unseenConversations: number = 0;
  public avatarUrl: String | undefined;
  public selectedFile: File | undefined;
  public repositoryRecipes: Recipe[] | undefined;
  public createdRecipes: Recipe[] | undefined;
  public addedRecipes: Recipe[] | undefined;
  public repositories: Repository[] = [];
  public showEditProfile: boolean = false;
  public nicknameAlreadyUsed: boolean = false;
  public friendRequestSent = false;
  public friendRequestAlreadySent = false;
  public isFriendWithUser: boolean = false;

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(
      () => {
        this.user = this.authService.getUser();
        this.fetchProfileUser();
        this.getUserTotalRecipes();
        this.getCreatedRecipes();
        this.getRepositories();
      });
  }

  public fetchProfileUser(): void {
    this.route.params.subscribe((params) => {
      const userNickname = params['userNickname'];
      this.userService.getUserDetailsByNickname(userNickname).subscribe(
        (response: User) => {
          this.profileUser = response;
          this.getProfileImage();
          this.getIsFriendWithUser();
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    })
  }

  public toggleProfileEdit(): void {
    this.showEditProfile = !this.showEditProfile;
  }

  public onEditProfile(editForm: NgForm): void {
    if (this.user && editForm) {
      this.userService.updateUserAttributes(this.user.userId, editForm).subscribe(
        (response: any) => {
          if (response.status == "NICKNAME ALREADY USED") {
            this.nicknameAlreadyUsed = true;
          }
          else if (response.status == "SUCCESS") {
            this.nicknameAlreadyUsed = false;
          }
          this.ngOnInit();
          this.toggleProfileEdit();
        },
        (error: HttpErrorResponse) => {
          console.error("ERROR editing profile attributes: " + error);
        }
      )
    }
  }

  public getUserTotalRecipes(): void {
    if (this.user) {
      this.recipeService.getUserTotalRecipes(this.user?.userId).subscribe(
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

  public getCreatedRecipes(): void {
    if (this.user) {
      this.recipeService.getCreatedRecipes(this.user?.userId).subscribe(
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

  public getRepositories(): void {
    if (this.user) {
      this.repositoryService.getRepositories(this.user.userId).subscribe(
        (response: Repository[]) => {
          this.repositories = response;
        },
        (error: HttpErrorResponse) => {
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

    if (mode == 'total') {
      button.setAttribute('data-target', '#totalRecipesModal');
    }
    else if (mode == 'created') {
      button.setAttribute('data-target', '#createdRecipesModal');
    }
    else if (mode == 'added') {
      button.setAttribute('data-target', '#addedRecipesModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public getIsFriendWithUser(): void {
    if (this.profileUser) {
      this.userService.getFriends(this.profileUser?.userId).subscribe(
        (friends: User[]) => {
          this.isFriendWithUser = friends.some(friend => friend.userId === this.user?.userId)
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
  }

  public sendFriendRequest(): void {
    if (this.user && this.profileUser) {
      this.friendsService.sendFriendRequest(this.user.userId, this.profileUser.userName).subscribe(
        (response: any) => {
          if (response.status == "SUCCESS") {
            this.friendRequestSent = true;
            this.friendRequestAlreadySent = false;
          }
          else if (response.status == "FRIEND REQUEST ALREADY SENT") {
            this.friendRequestSent = false;
            this.friendRequestAlreadySent = true;
          }

        },
        (error: HttpErrorResponse) => {
          console.error("ERROR: " + error);
        }
      );
    }
  }

  public onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if (this.selectedFile) {
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
          this.toggleProfileEdit();
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading profile image:', error);
        }
      );
    }
  }

  public getProfileImage() {
    if (this.profileUser?.userId) {
      this.userService.getProfileImage(this.profileUser.userId).subscribe(
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

  public onOpenRepository(repository: Repository): void {
    this.router.navigate([`/repository/${repository.id}`]);
  }

  public userChatFriend(friendUserName: string): void {
    this.router.navigate([`/chat/${friendUserName}`]);
  }
}
