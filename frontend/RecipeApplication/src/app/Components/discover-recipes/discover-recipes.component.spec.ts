import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverRecipesComponent } from './discover-recipes.component';

describe('DiscoverRecipesComponent', () => {
  let component: DiscoverRecipesComponent;
  let fixture: ComponentFixture<DiscoverRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoverRecipesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscoverRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
