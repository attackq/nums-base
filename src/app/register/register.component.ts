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
  public lastUserId: number;
  public showPassword: boolean = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((users: User[]) => {
      if (users.length !== 0) {
        this.lastUserId = users[users.length - 1].id;
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
    let lastName = this.registerForm.value.lastName
      .toLowerCase()
      .replaceAll(/\s/g, '');
    lastName =
      lastName.slice(0, 1).toUpperCase() + lastName.slice(1, lastName.length);
    let username = this.registerForm.value.username
      .toLowerCase()
      .replaceAll(/\s/g, '');
    const newUser: User = {
      id: this.lastUserId + 1,
      role: 'stuff',
      username: username,
      password: this.registerForm.value.password,
      lastName: lastName,
      createdAt: Date.now(),
      tokenId: nanoid(),
    };
    if (this.registerForm.valid) {
      this.authService
        .getUserByUsername(username)
        .pipe(
          map((user: User[]) => {
            if (user.length === 0) {
              return user;
            } else {
              throw Error;
            }
          }),
          switchMap(() => {
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
