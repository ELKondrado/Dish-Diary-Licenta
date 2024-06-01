import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RecipeService } from '../../Models/Recipe/recipe.service';
import { AuthService } from '../../Security/auth.service';
import { Recipe } from '../../Models/Recipe/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../Models/User/user.service';
import { User } from '../../Models/User/user';
import { Review } from '../../Models/Review/review';
import { ReviewService } from '../../Models/Review/review.service';
import { Notif } from '../../Models/Notification/notification';
import { DatePipe } from '@angular/common';
import { Repository } from '../../Models/Repository/repository';
import { RepositoryService } from '../../Models/Repository/repository.service';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrl: './recipe-info.component.css'
})
export class RecipeInfoComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private recipeService: RecipeService,
    private reviewService: ReviewService,
    private repositoryService: RepositoryService,
    private router: Router
  ) { }

  public user: User | null = null;
  public friends: User[] = [];
  public recipe: Recipe | undefined;
  public avatarUrl: String | undefined;
  public recipeUrl: String | undefined;
  public selectedFile: File | undefined;
  public reviews: Review[] | undefined;
  public showReviewForm: boolean = false;
  public likedReviewsByUser: Review[] = [];
  public averageRating: number = 0;
  public deletedReview: Review | undefined;
  public addedRecipe: Recipe | undefined;
  public repositories: Repository[] = [];
  public reviewModel: Review = {
    id: 1,
    userOwner: null,
    userStarRating: 1,
    userReviewText: '',
    likes: 0,
    date: new Date(),
  };

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.fetchRecipe();
      this.getProfileImage();
      this.getFriends();
      this.getLikedReviewsByUser();
      this.getRepositories();
    });
  }

  public fetchRecipe(): void {
    this.route.params.subscribe((params) => {
      const recipeId = params['recipeId'];
      this.recipeService.getRecipeById(recipeId).subscribe(
        (recipe: Recipe) => {
          this.recipe = recipe;
          this.recipe.userOwner.profileImage = 'data:image/jpeg;base64,' + this.recipe.userOwner.profileImage;
          this.getRecipeImage();
          this.fetchReviewsForRecipe();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public fetchReviewsForRecipe() {
    if (this.recipe?.id) {
      this.reviewService.getReviewsForRecipe(this.recipe.id).subscribe(
        (reviews: Review[]) => {
          this.reviews = reviews.sort((a, b) => b.likes - a.likes);
          this.fetchUserProfilesForReviews();
          this.fetchAverageRating();
        },
        (error: HttpErrorResponse) => {
          console.error('Error getting the reviews:', error);
        }
      );
    }
  }

  public fetchUserProfilesForReviews() {
    if (this.reviews) {
      this.reviews.forEach(review => {
        if (review.userOwner) {
          review.userOwner.profileImage = 'data:image/jpeg;base64,' + review.userOwner.profileImage;
        }
      });
    }
  }

  public fetchAverageRating() {
    this.averageRating = 0;

    if (this.reviews && this.reviews.length !== 0) {
      this.reviews.forEach((review) => (this.averageRating += review.userStarRating));
      this.averageRating /= this.reviews.length;
    }
  }

  public getLikedReviewsByUser(): void {
    if (this.user) {
      this.reviewService.getLikedReviews(this.user.userId).subscribe(
        (likedReviews: Review[]) => {
          this.likedReviewsByUser = likedReviews;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  public isReviewLiked(review: Review): boolean {
    const likedReviewIds = this.likedReviewsByUser.map(likedReview => likedReview.id);
    return likedReviewIds.includes(review.id);
  }

  public toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  public getFriends(): void {
    if (this.user) {
      this.userService.getFriends(this.user.userId).subscribe(
        (response: User[]) => {
          this.friends = response;
          this.friends.forEach(friend => {
            friend.profileImage = 'data:image/jpeg;base64,' + friend.profileImage;
          });
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public getRepositories(): void {
    if (this.user) {
      this.repositoryService.getRepositoriesDto(this.user.userId).subscribe(
        (response: Repository[]) => {
          this.repositories = response;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  public onOpenModal(recipe: Recipe | undefined, mode: string): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    this.addedRecipe = recipe;

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode == 'add') {
      this.getRepositories();
      button.setAttribute('data-target', '#addRecipeToRepositoryModal');
    }
    else if (mode == 'share') {
      button.setAttribute('data-target', '#shareRecipeToFriendModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public addRecipeToRepository(recipeId: number, repository: Repository): void {
    this.recipeService.addRecipeToRepository(recipeId, repository.id).subscribe(
      (response: any) => {
        repository.addedRecipe = true;
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public shareRecipe(friend: User): void {
    if (this.user && this.recipe) {
      console.log(this.user)
      this.recipeService.shareRecipe(this.user.userId, this.recipe.id, friend.userId).subscribe(
        (response: Notif) => {
          console.log(response);
          friend.recipeSent = true;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public likeReview(reviewId: number): void {
    if (this.user) {
      this.reviewService.likeReview(reviewId, this.user.userId).subscribe(
        (response: any) => {
          this.getLikedReviewsByUser();
          this.fetchReviewsForRecipe();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public dislikeReview(reviewId: number): void {
    if (this.user) {
      this.reviewService.dislikeReview(reviewId, this.user.userId).subscribe(
        (response: any) => {
          this.getLikedReviewsByUser();
          this.fetchReviewsForRecipe();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    }
  }

  public addReview(): void {
    if (this.user && this.recipe) {
      this.reviewModel.userOwner = this.user;
      this.reviewModel.date = new Date();
      this.reviewModel.likes = 0;

      this.reviewService.addReviewToRecipe(this.recipe.id, this.user.userName, this.reviewModel).subscribe(
        (response: Review) => {
          this.fetchReviewsForRecipe();
        },
        (error: HttpErrorResponse) => {
          console.error("Error adding the review:" + error);
        }
      );
    }
    this.showReviewForm = false;
  }

  public onDeleteReviewModal(review: Review | undefined): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    this.deletedReview = review;

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#deleteReviewForRecipeModal');

    container?.appendChild(button);
    button.click();
  }

  public deleteReviewForRecipe(reviewId: number) {
    if (this.user && this.recipe) {
      this.reviewService.deleteReviewsForRecipe(this.recipe.id, reviewId).subscribe(
        () => {
          this.fetchReviewsForRecipe();
        },
        (error: HttpErrorResponse) => {
          console.error("Error adding the review:" + error);
        }
      );
    }
  }

  public addRecipeToUser(recipeId: number): void {
    const username = this.authService.getUsernameFromToken();

    const container = document.getElementById("main-container");
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    container?.appendChild(button);

    // this.recipeService.addUserRecipe(username, recipeId).subscribe(
    //   (response: any) => {
    //     if (response) {
    //       this.ngOnInit();
    //       button.setAttribute('data-target', '#recipeSuccesModal');
    //       button.click();
    //     }
    //   },
    //   (error: HttpErrorResponse) => {
    //     console.error(error);
    //   }
    // );
  }

  public onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
        reader.onload = (eventReader: any) => {
          this.recipeUrl = eventReader.target.result;
          this.uploadImage();
        };
      }
    }
  }

  public uploadImage() {
    if (this.recipe?.id && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.recipeService.uploadImage(this.recipe.id, formData).subscribe(
        () => {
          this.getRecipeImage();
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

  public getRecipeImage() {
    if (this.recipe?.id) {
      this.recipeService.getImage(this.recipe.id).subscribe(
        (data: any) => {
          this.recipeUrl = this.arrayBufferToBase64(data);
        },
        (error: HttpErrorResponse) => {
          console.error('Error getting recipe image:', error);
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

  public formattedDate(date: string): string | null {
    return this.datePipe.transform(date, 'M/d/yyyy HH:mm');
  }

  public onOpenFriendProfile(friendNickname: String): void {
    this.router.navigate([`/${this.userService.getUsername()}/friend-profile/${friendNickname}`]);
  }
}
