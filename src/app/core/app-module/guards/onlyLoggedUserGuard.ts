import { AuthService } from './../../../auth/services/auth.service';
import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {

  /**
   *
   */
  constructor( private autService: AuthService) {

  }

  public canActivate() {
    return this.autService.getUserLogged() !== null;
  }
}
