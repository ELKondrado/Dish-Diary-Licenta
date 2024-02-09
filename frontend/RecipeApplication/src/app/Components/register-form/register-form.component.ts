import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/User/user';
import { UserService } from '../../Models/User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit(): void {

  }

  public onRegisterUser(registerForm: NgForm): void {
    this.userService.register(registerForm.value).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    );
  }
}
