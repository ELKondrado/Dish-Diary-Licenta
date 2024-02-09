import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    //this.getUsers();
  }


  public onLoginUser(loginForm: NgForm): void {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        console.log(response);
        this.router.navigate(['/main']);
      },
      (error: HttpErrorResponse) => {
        console.error(error.error.error);
        // Handle authentication error
      }
    );
  }

}
