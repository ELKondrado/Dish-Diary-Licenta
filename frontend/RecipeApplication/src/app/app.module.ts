import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RecipeService } from './Models/Recipe/recipe.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { RegisterFormComponent } from './Components/register-form/register-form.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RepositoryComponent } from './Components/repository/repository.component';
import { UserService } from './Models/User/user.service';
import { AuthGuard } from './Security/auth.guard';
import { AuthService } from './Security/auth.service';
import { DiscoverRecipesComponent } from './Components/discover-recipes/discover-recipes.component';
import { RecipeInfoComponent } from './Components/recipe-info/recipe-info.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { UserFriendsComponent } from './Components/user-friends/user-friends.component';
import { UserNotificationsComponent } from './Components/user-notifications/user-notifications.component';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'starter-page', component: StarterPageComponent, canActivate: [AuthGuard] },
  { path: 'repository/:repositoryId', component: RepositoryComponent, canActivate: [AuthGuard] },
  { path: 'recipes', component: DiscoverRecipesComponent, canActivate: [AuthGuard] },
  { path: 'recipe/:recipeId', component: RecipeInfoComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userNickname', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: UserFriendsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: UserNotificationsComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: UserChatComponent, canActivate: [AuthGuard] },
  { path: 'chat/:friendUserName', component: UserChatComponent, canActivate: [AuthGuard] },
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
    UserChatComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
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
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
