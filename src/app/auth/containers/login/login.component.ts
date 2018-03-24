import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string;
  pwd: string;
  error: Boolean = false;

  constructor(private authServ: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logIn() {
    this.authServ.logIn(this.userName, this.pwd).subscribe(
      res => {
        if (res === true) {
          // login ok
          this.router.navigateByUrl('graph');
        } else {
          // login error
          this.error = true;
        }
      }
    );
  }
}
