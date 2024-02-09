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

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginFormComponent},
  {path: 'register', component: RegisterFormComponent},
  {path: 'main', component: MainPageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegisterFormComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
