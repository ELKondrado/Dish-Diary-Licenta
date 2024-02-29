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
            
  public usernameTaken: boolean = false;
  public passwordCondition: boolean = false;
  public passwordsNotMatch: boolean = false;
  public nickanameTaken: boolean = false;
  public emailTaken: boolean = false;
  public fillAllFields: boolean = false;

  ngOnInit(): void {

  }

  public onRegisterUser(registerForm: NgForm): void {
    this.userService.register(registerForm.value).subscribe(
      (response: any) => {
        if(response.status == "SUCCESS") {
          this.userService.login(registerForm.value).subscribe(
            (response: any) => {
              this.userService.setUsername(registerForm.value.username)
              this.authService.setAccessToken(response.token);
              localStorage.setItem('access_token', response.token);
              this.router.navigate([`/${this.userService.getUsername()}/main`]);
            }
          )
        }
        else {
          console.log(response)
          this.usernameTaken = response.statusUsername === "USERNAME IS TAKEN";
          this.passwordCondition = response.statusPassword === "PASSWORD IS NOT STRONG ENOUGH";
          this.passwordsNotMatch = response.statusConfirmPassword === "PASSWORD DOES NOT MATCH";
          this.nickanameTaken = response.statusNickname === "NICKNAME IS TAKEN";
          this.emailTaken = response.statusEmail === "EMAIL IS TAKEN";
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }
}
