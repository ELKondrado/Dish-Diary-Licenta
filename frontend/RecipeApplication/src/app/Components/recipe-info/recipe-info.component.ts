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
import { NotificationService } from '../../Models/Notification/notification.service';
import { Notif } from '../../Models/Notification/notification';
import { DatePipe } from '@angular/common';
import { MessageService } from '../../Models/Message/message.service';

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
    private notificationService: NotificationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  public user: User | null = null;
  public username: string | undefined;
  public notifications: Notif[] | undefined;
  public unseenConversations: number = 0;
  public userRecipes: Recipe[] | undefined;
  public recipe: Recipe | undefined;
  public isRecipeInUserRecipes: boolean = false;
  public avatarUrl: String | undefined;
  public recipeUrl: String | undefined;
  public selectedFile: File | undefined;
  public reviews: Review[] | undefined;
  public showReviewForm: boolean = false;
  public likedReviewsByUser: Review[] = [];
  public averageRating: number = 0;
  public deletedReview: Review | undefined;
  public addedRecipe: Recipe | undefined;
  public reviewModel: Review = { 
    id: 1,
    userOwner: null,
    userStarRating: 1,
    userReviewText: '',
    likes: 0,
    date: new Date(), 
  };

  ngOnInit(): void {
    this.fetchData();
    this.fetchUser();
  }

  public fetchData(): void{
    this.authService.initializeApp().subscribe(() => {
      this.user = this.authService.getUser();
      this.username = this.userService.getUsername();
      this.fetchRecipe();
      this.getProfileImage();
      this.getUserRecipes();
      this.getNotifications();
      this.getUnseenConversations();
      this.getLikedReviewsByUser();
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

  public fetchRecipe(): void{
    this.route.params.subscribe((params) => {
      const recipeId = params['recipeId'];
      this.recipeService.getRecipeById(recipeId).subscribe(
        (recipe: Recipe) => {
          console.log(recipe)
          this.recipe = recipe;
          this.getRecipeImage();
          this.fetchReviewsForRecipe();
          console.log(this.user);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    });
  }

  public fetchReviewsForRecipe() {
    if (this.recipe?.id) 
    {
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
    if(this.reviews){
      this.reviews.forEach(review => {
        if(review.userOwner){
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
    if(this.user) {
      this.reviewService.getLikedReviews(this.user.userId).subscribe(
        (likedReviews: Review[]) => {
          this.likedReviewsByUser = likedReviews;
          console.log(likedReviews);
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  public isReviewLiked(review: Review): boolean {
    console.log('Liked Reviews By User:', this.likedReviewsByUser);
    console.log('Review ID:', review.id);
    const likedReviewIds = this.likedReviewsByUser.map(likedReview => likedReview.id);
    console.log('Liked Review IDs:', likedReviewIds);
    console.log( likedReviewIds.includes(review.id))
    console.log("\n")
    return likedReviewIds.includes(review.id);
  }
  
  public toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  public toggleMenu(){
    let subMenu = document.getElementById("subMenu");
    subMenu?.classList.toggle("open-menu");
  }

  public getNotifications(): void {
    if(this.user)
    {
      this.notificationService.getNotifications(this.user.userId).subscribe(
        (notifications: Notif[]) => {
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

  public onAddRecipeModal(recipe: Recipe | undefined): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    this.addedRecipe = recipe;

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addRecipeToUserModal');

    container?.appendChild(button);
    button.click();
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
    if(this.user && this.recipe) {
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
    if(this.user && this.recipe) {
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

  public getUserRecipes(): void{
    if(this.user)
    {
      this.recipeService.getUserRecipes(this.user.userId).subscribe(
        (recipes: Recipe[]) => {
          this.userRecipes = recipes;
          this.userRecipes.forEach(recipe => {
            recipe.image = 'data:image/jpeg;base64,' + recipe.image;
          });
          this.isRecipeInUserRecipes = !!this.recipe && !!this.userRecipes && this.userRecipes.some(userRecipe => userRecipe.id == this.recipe?.id);

        },
        (error) => {
          console.error(error);
        }
      );
    }
    else{
      console.error("User for getUserRecipes not found!")
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

    this.recipeService.addUserRecipe(username, recipeId).subscribe(
      (response: any) => {
        if (response) {
          this.ngOnInit();
          button.setAttribute('data-target', '#recipeSuccesModal');
          button.click();
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  public onSelectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      if(this.selectedFile)
      {
          reader.readAsDataURL(this.selectedFile);
          reader.onload = (eventReader: any) => {
          this.recipeUrl = eventReader.target.result;
          this.uploadImage();
        };
      }
    }
  }
  
  public uploadImage() {
    if (this.recipe?.id && this.selectedFile) 
    {
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
    if (this.user?.userId) 
    {
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
    if (this.recipe?.id) 
    {
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

  public formattedDate(date: string): string | null{
    return this.datePipe.transform(date, 'M/d/yyyy HH:mm');
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
