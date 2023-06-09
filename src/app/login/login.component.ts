import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../service/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  users: any;
  currentUser: any;
  loginForm: FormGroup = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  });

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.authService.getUserByUsername('a.panasik').subscribe((res: User[]) => {
      console.log(res[0]);
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.authService
        .getUserByUsername(this.loginForm.value.username)
        .pipe(
          tap((res: any) => {
            this.currentUser = res;
            if (this.currentUser.length !== 0) {
              if (
                this.loginForm.value.password === this.currentUser[0].password
              ) {
                sessionStorage.setItem(
                  'username',
                  this.currentUser[0].username
                );
                sessionStorage.setItem('role', this.currentUser[0].role);
                sessionStorage.setItem(
                  'fullName',
                  this.currentUser[0].fullName
                );
                this.router.navigate(['users']);
                this.toastr.success('Successfully logged!');
              } else {
                this.toastr.error('Invalid credentials!');
                this.loginForm.reset();
              }
            } else {
              this.toastr.error('Invalid credentials!');
              this.loginForm.reset();
            }
          })
        )
        .subscribe();
    } else {
      this.toastr.error('Invalid credentials!');
    }
  }
}
