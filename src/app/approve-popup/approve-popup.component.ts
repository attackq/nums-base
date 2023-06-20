import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, tap } from 'rxjs';
import { Card, CardNumber, NewNumber } from '../service/number.interface';

@Component({
  selector: 'app-approve-popup',
  templateUrl: './approve-popup.component.html',
  styleUrls: ['./approve-popup.component.css'],
})
export class ApprovePopupComponent {
  public newData: NewNumber;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      username: string;
      titleText: string;
      text: string;
      fn: string;
      currentCardId: string;
    },
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  deleteUser(id: string) {
    this.authService.deleteUser(id).subscribe(() => {
      this.toastr.success('Пользователь удален!');
    });
  }

  deleteNumber(id: string) {
    this.authService
      .getCardById(this.data.currentCardId)
      .pipe(
        map((res: Card) => {
          return res.data.map((i) => {
            if (i.id === id) {
              const empty: CardNumber = {
                title: '',
                id: id,
                product: '',
                creatorName: '',
                createdAt: null,
              };
              return empty;
            } else {
              return i;
            }
          });
        }),
        tap((res: CardNumber[]) => {
          this.newData = {
            data: res,
          };
        }),
        switchMap(() => {
          return this.authService.deleteNumber(
            this.data.currentCardId,
            this.newData
          );
        })
      )
      .subscribe(() => {
        this.toastr.success('Номер удален!');
      });
  }
}
