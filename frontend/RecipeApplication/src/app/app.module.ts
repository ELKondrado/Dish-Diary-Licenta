import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RecipeService } from './Models/Recipe/recipe.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { RegisterFormComponent } from './Components/register-form/register-form.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { RepositoryComponent } from './Components/repository/repository.component';
import { UserService } from './Models/User/user.service';
import { AuthGuard } from './Security/auth.guard';
import { AuthService } from './Security/auth.service';
import { DiscoverRecipesComponent } from './Components/discover-recipes/discover-recipes.component';
import { RecipeInfoComponent } from './Components/recipe-info/recipe-info.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { IonicModule } from '@ionic/angular';
import { UserFriendsComponent } from './Components/user-friends/user-friends.component';
import { UserNotificationsComponent } from './Components/user-notifications/user-notifications.component';
import { FriendUserProfileComponent } from './Components/friend-user-profile/friend-user-profile.component';
import { UserChatComponent } from './Components/user-chat/user-chat.component';
import { DatePipe } from '@angular/common';
import { WebSocketService } from './web-socket.service';
import { ConversationService } from './Models/Conversation/conversation.service';
import { FriendsService } from './Models/Friendship/friends.service';
import { MessageService } from './Models/Message/message.service';
import { NotificationService } from './Models/Notification/notification.service';
import { ReviewService } from './Models/Review/review.service';
import { StarterPageComponent } from './Components/starter-page/starter-page.component';
import { HeaderComponent } from './Components/header/header.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: ':username/starter-page', component: StarterPageComponent, canActivate: [AuthGuard] },
  { path: ':username/repository/:repositoryId', component: RepositoryComponent, canActivate: [AuthGuard] },
  { path: ':username/recipes', component: DiscoverRecipesComponent, canActivate: [AuthGuard] },
  { path: ':username/recipe/:recipeId', component: RecipeInfoComponent, canActivate: [AuthGuard] },
  { path: ':username/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: ':username/friends', component: UserFriendsComponent, canActivate: [AuthGuard] },
  { path: ':username/notifications', component: UserNotificationsComponent, canActivate: [AuthGuard] },
  { path: ':username/friend-profile/:friendUserNickname', component: FriendUserProfileComponent, canActivate: [AuthGuard] },
  { path: ':username/chat', component: UserChatComponent, canActivate: [AuthGuard] },
  { path: ':username/chat/:friendUserName', component: UserChatComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    StarterPageComponent,
    RepositoryComponent,
    DiscoverRecipesComponent,
    RecipeInfoComponent,
    UserProfileComponent,
    UserFriendsComponent,
    UserNotificationsComponent,
    FriendUserProfileComponent,
    UserChatComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    IonicModule.forRoot(),
  ],
  providers: [
    AuthService,
    RecipeService,
    UserService,
    ConversationService,
    FriendsService,
    MessageService,
    NotificationService,
    ReviewService,
    WebSocketService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
