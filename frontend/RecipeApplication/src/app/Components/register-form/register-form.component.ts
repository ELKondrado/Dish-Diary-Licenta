import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/User/user';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../Security/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router
              ) {}

  ngOnInit(): void {

  }

  public onRegisterUser(registerForm: NgForm): void {
    this.userService.register(registerForm.value).subscribe(
      (response: any) => {
        console.log(response);
        this.userService.login(registerForm.value).subscribe(
          (response: any) => {
            this.userService.setUsername(registerForm.value.username)
            this.authService.setAccessToken(response.token);
            localStorage.setItem('access_token', response.token);
            this.router.navigate([`/${this.userService.getUsername()}/main`]);
          }
        )
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }
}
