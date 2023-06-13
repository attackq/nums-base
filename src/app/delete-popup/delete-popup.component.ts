import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css'],
})
export class DeletePopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: string; username: string },
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  deleteUser(id: string) {
    this.authService.deleteUser(id).subscribe(() => {
      this.toastr.success('Пользователь удален!');
    });
  }
}
