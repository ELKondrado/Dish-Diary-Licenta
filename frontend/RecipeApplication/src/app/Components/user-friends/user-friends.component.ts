import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Security/auth.service';
import { UserService } from '../../Models/User/user.service';
import { Router } from '@angular/router';
import { User } from '../../Models/User/user';
import { HttpErrorResponse } from '@angular/common/http';
import { FriendsService } from '../../Models/Friendship/friends.service';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrl: './user-friends.component.css'
})
export class UserFriendsComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private friendsService: FriendsService,
    private router: Router
  ) {}

  public user: User | null = null;
  public friendToAdd: String = "";
  public removedFriend: User | undefined;
  public friendAdded: boolean = false;
  public friendRequestSent: boolean = false;
  public nicknameAddedNotFound: boolean = false;
  public friendRequestAlreadySent: boolean = false;
  public friendRequestAlreadyFriend: boolean = false;
  public friendRequestCannotAddYourself: boolean = false;
  public showFriendRequestForm: boolean = false;
  public avatarUrl: String | undefined;
  public friends: User[] = [];

  ngOnInit(): void {
    this.authService.initializeApp().subscribe(
      () => {
      this.user = this.authService.getUser();
      this.getFriends();
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

  public toggleFriendRequestForm() {
    this.showFriendRequestForm = !this.showFriendRequestForm;
  }

  public onAddRecipeModal(): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addFriendModal');

    container?.appendChild(button);
    button.click();
  }

  public sendFriendRequest(): void {
    if(this.user){
      this.friendsService.sendFriendRequest(this.user.userId, this.friendToAdd.toString()).subscribe(
        (response: any) => {
          console.log(response)
          if(response.status == "FRIEND ADDED"){
            this.friendAdded = true;
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "SUCCESS"){
            this.friendAdded = false;
            this.friendRequestSent = true;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "USER RECEIVER NOT FOUND"){
            this.friendAdded = false;
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = true;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "FRIEND REQUEST ALREADY SENT"){
            this.friendAdded = false;
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = true;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "RECEIVER ALREADY FRIEND"){
            this.friendAdded = false;
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = true;
            this.friendRequestCannotAddYourself = false;
          }
          else if(response.status == "CANNOT ADD YOURSELF"){
            this.friendAdded = false;
            this.friendRequestSent = false;
            this.nicknameAddedNotFound = false;
            this.friendRequestAlreadySent = false;
            this.friendRequestAlreadyFriend = false;
            this.friendRequestCannotAddYourself = true;
          }

        },
        (error: HttpErrorResponse) => {
          console.error("ERROR: " + error);
        }
      );
    }
  }

  public onRemoveFriendModal(friend: User): void {
    const container = document.getElementById("main-container");
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#removeFriendModal');
    this.removedFriend = friend;
    container?.appendChild(button);
    button.click();
  }

  public removeFriend(): void {
    if(this.user && this.removedFriend) {
      this.friendsService.removeFriend(this.user.userId, this.removedFriend.userId).subscribe(
        (response: any) => {
          this.getFriends();
          console.log(response)
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      )
    }
  }

  public onOpenFriendProfile(friendNickname: String): void {
    this.router.navigate([`/profile/${friendNickname}`]);
  }
}
