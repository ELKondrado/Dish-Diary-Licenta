import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './Security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title = 'Dish-Diary';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.initializeAuthentication();
  }

  ngOnInit(): void {}

  shouldShowHeader(): boolean {
    return (
      !this.router.url.includes('/login') &&
      !this.router.url.includes('/register')
    );
  }
}
