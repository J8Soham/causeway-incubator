import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeploymentWarningComponent } from './redeployment-warning.component';

describe('RedeploymentWarningComponent', () => {
  let component: RedeploymentWarningComponent;
  let fixture: ComponentFixture<RedeploymentWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RedeploymentWarningComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeploymentWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
