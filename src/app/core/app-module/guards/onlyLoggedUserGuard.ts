import { AuthService } from './../../../auth/services/auth.service';
import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

@Injectable()
class OnlyLoggedInUsersGuard implements CanActivate {

  /**
   *
   */
  constructor( private autService: AuthService) {

  }

  public canActivate(): Boolean {
    return this.autService.getUserLogged() !== null;
  }
}