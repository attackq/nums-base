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
  currentUser: User;
  loginForm: FormGroup = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
  });
  public showPassword: boolean = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.authService
        .getUserByUsername(this.loginForm.value.username.toLowerCase())
        .pipe(
          tap((val: User[]) => {
            this.currentUser = val[0];
            if (this.currentUser) {
              if (this.loginForm.value.password === this.currentUser.password) {
                localStorage.setItem('tokenId', `${this.currentUser.tokenId}`);
                this.authService.user$.next(this.currentUser);
                this.router.navigate(['users']);
                this.toastr.success('Авторизация успешно завершена!');
              } else {
                this.toastr.error('Неверный пароль!');
                this.loginForm.controls['password'].setValue('');
              }
            } else {
              this.toastr.error(
                'Пожалуйста, зарегестрируйтесь.',
                'Пользователь не найден.'
              );
            }
          })
        )
        .subscribe();
    } else {
      this.toastr.error('Неверные данные.');
    }
  }
}
