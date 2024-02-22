import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RecipeService } from './Models/Recipe/recipe.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginFormComponent } from './Components/login-form/login-form.component';
import { RegisterFormComponent } from './Components/register-form/register-form.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterOutlet } from '@angular/router';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { UserService } from './Models/User/user.service';
import { AuthGuard } from './Security/auth.guard';
import { AuthService } from './Security/auth.service';
import { DiscoverRecipesComponent } from './Components/discover-recipes/discover-recipes.component';
import { RecipeInfoComponent } from './Components/recipe-info/recipe-info.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginFormComponent},
  {path: 'register', component: RegisterFormComponent},
  {path: ':username/main', component: MainPageComponent, canActivate: [AuthGuard]},
  {path: ':username/recipes', component: DiscoverRecipesComponent, canActivate: [AuthGuard]},
  {path: ':username/recipe/:recipeId', component: RecipeInfoComponent, canActivate: [AuthGuard]},
  {path: ':username/profile', component: UserProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    MainPageComponent,
    DiscoverRecipesComponent,
    RecipeInfoComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    IonicModule.forRoot()
  ],
  providers: [
    AuthService,
    RecipeService,
    UserService,
  ],  
  bootstrap: [AppComponent],
})
export class AppModule {}
