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
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userId: string; username: string; lastname: string },
    private builder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  public editForm: FormGroup = this.builder.group({
    username: this.builder.control(this.data.username, Validators.required),
    lastName: this.builder.control(this.data.lastname, Validators.required),
  });

  editUser() {
    if (
      this.data.username !== this.editForm.value.username ||
      this.data.lastname !== this.editForm.value.lastName
    ) {
      this.authService
        .editUser(this.data.userId, this.editForm.value)
        .pipe(
          switchMap(() => {
            return this.authService.getUserById(this.data.userId).pipe(
              tap((user: User) => {
                if (user.tokenId === localStorage.getItem('tokenId')) {
                  this.authService.user$.next(user);
                }
              })
            );
          })
        )
        .subscribe(() => {
          this.toastr.success('Пользователь изменён!');
        });
    } else {
      this.toastr.warning('Данные не изменены!');
    }
  }
}
