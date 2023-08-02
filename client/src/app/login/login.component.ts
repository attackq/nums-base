import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../service/user.interface';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public currentUser: User;
  captcha: string;
  public showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  public loginForm: FormGroup = this.fb.group({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required),
  });
  ngOnInit(): void {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  loginUser() {
    if (this.loginForm.valid) {
      this.authService
        .getUserByUsername(this.loginForm.value.username.toLowerCase())
        .pipe(
          tap((user: User[]) => {
            this.currentUser = user[0];
            if (this.currentUser) {
              // console.log(this.currentUser);
              if (this.loginForm.value.password === this.currentUser.password) {
                localStorage.setItem('tokenId', `${this.currentUser.tokenId}`);
                this.authService.user$.next(this.currentUser);
                this.router.navigate(['numbers']);
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
