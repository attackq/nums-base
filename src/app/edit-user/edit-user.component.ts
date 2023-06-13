import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs';
import { User } from '../service/user.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  public showPassword: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: string; username: string; lastname: string },
    private builder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  registerForm: FormGroup = this.builder.group({
    username: this.builder.control(this.data.username, Validators.required),
    lastName: this.builder.control(this.data.lastname, Validators.required),
  });

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  editUser() {
    this.authService
      .editUser(this.data.userId, this.registerForm.value)
      .pipe(
        switchMap(() => {
          return this.authService
            .getUserByUsername(this.registerForm.value.username)
            .pipe(tap((user: User[]) => this.authService.user$.next(user[0])));
        })
      )
      .subscribe(() => {
        this.toastr.success('Пользователь изменён!');
      });
  }
}
