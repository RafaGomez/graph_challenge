import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from '../../auth.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ LoginComponent ],
      providers: [{ provide: Router, useValue: mockRouter }, AuthService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT navigate with a login failure', () => {
    component.pwd = 'test';
    component.userName = 'fail';
    component.logIn();
    fixture.detectChanges();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(0);
  });

  it('should navigate with a login ok', () => {
    component.pwd = 'test';
    component.userName = 'test';
    component.logIn();
    fixture.detectChanges();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('graph');
  });

});
