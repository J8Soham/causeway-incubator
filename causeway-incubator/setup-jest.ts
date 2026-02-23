import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import '@testing-library/jest-dom';

setupZoneTestEnv();

TestBed.configureTestingModule({
  imports: [BrowserAnimationsModule]
});