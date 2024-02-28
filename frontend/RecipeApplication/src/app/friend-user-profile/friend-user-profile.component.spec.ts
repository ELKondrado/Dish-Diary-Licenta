import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendUserProfileComponent } from './friend-user-profile.component';

describe('FriendUserProfileComponent', () => {
  let component: FriendUserProfileComponent;
  let fixture: ComponentFixture<FriendUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendUserProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
