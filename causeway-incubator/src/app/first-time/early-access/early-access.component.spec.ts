import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyAccessComponent } from './early-access.component';
import { DATABASE_SERVICE } from 'src/app/core/firebase/database.service';
import { FirebaseMockService } from 'src/app/core/firebase/firebase.mock.service';
import { BatchWriteMockService } from 'src/app/core/store/batch-write.mock.service';
import { BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { AuthLoggedInMockDB } from 'src/app/core/store/auth/auth.mock';

describe('EarlyAccessComponent', () => {
  let component: EarlyAccessComponent;
  let fixture: ComponentFixture<EarlyAccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EarlyAccessComponent],
      providers: [
        { provide: AuthStore, useClass: AuthLoggedInMockDB }, // Needed to use `currentUser()`
        { provide: DATABASE_SERVICE, useClass: FirebaseMockService },
        { provide: BATCH_WRITE_SERVICE, useClass: BatchWriteMockService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
