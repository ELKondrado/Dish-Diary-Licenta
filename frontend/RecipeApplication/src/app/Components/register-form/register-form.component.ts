import { Component, OnInit } from '@angular/core';
import { User } from '../../User/user';
import { UserService } from '../../User/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  public users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    //this.getUsers();
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        console.log(this.users);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onRegisterUser(registerForm: NgForm): void {
    console.log(registerForm.value)
    this.userService.addUser(registerForm.value).subscribe(
      (response: User) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
