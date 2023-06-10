import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, isEmpty, map, switchMap, tap, throwError } from 'rxjs';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  users: any;
  lastUserId: number;
  public newUser: User;
  public res: any;
  public showPassword: boolean = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((res) => {
      if (Object.entries(res).length !== 0) {
        this.users = res;
        this.lastUserId = this.users[this.users.length - 1].id;
      }
    });
  }

  registerForm: FormGroup = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
  });

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  registerUser() {
    const newUser: User = {
      id: this.lastUserId + 1,
      role: 'stuff',
      username: this.registerForm.value.username.toLowerCase(),
      password: this.registerForm.value.password,
      lastName: this.registerForm.value.lastName.toLowerCase(),
      createdAt: Date.now(),
      tokenId: nanoid(),
    };
    if (this.registerForm.valid) {
      this.authService
        .getUserByUsername(this.registerForm.value.username.toLowerCase())
        .pipe(
          map((val: User[]) => {
            if (val.length === 0) {
              return val;
            } else {
              throw Error;
            }
          }),
          switchMap((val: User[]) => {
            return this.authService.registerUser(newUser).pipe(
              tap(() => {
                this.toastr.success(
                  'Войдите используя логин и пароль.',
                  'Регистрация успешно завершена!'
                );
                this.router.navigate(['']);
              })
            );
          })
        )
        .subscribe({
          error: (err) => {
            this.toastr.error('Пользователь с таким логином уже существует!');
            this.registerForm.reset();
          },
        });
    } else {
      this.toastr.error('Неверные данные.');
    }
  }
}
