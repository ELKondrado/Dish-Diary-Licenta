import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => {
    const authGuard = TestBed.inject(AuthGuard);
    return authGuard.canActivate(...guardParameters);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
