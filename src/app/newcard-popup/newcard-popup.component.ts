import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Number } from '../service/number.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, switchMap, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-newcard-popup',
  templateUrl: './newcard-popup.component.html',
  styleUrls: ['./newcard-popup.component.css'],
})
export class NewcardPopupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cardId: string },
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  addNumber() {
    const newCard: Number = {
      id: this.data.cardId,
      data: [
        {
          title: '',
          id: 0,
          product: '',
          creatorName: '',
          createdAt: 0,
        },
      ],
    };
    this.authService
      .getAllNumbers()
      .pipe(
        map((nums: Number[]) => {
          nums.map((i: Number) => {
            if (i.id.includes(this.data.cardId)) {
              this.toastr.error('Группа уже сушествует!');
            }
          });
        }),
        switchMap(() => {
          return this.authService.addCard(newCard);
        }),
        tap(() => {
          this.toastr.success('Группа создана!');
          this.router.navigate(['numbers/details', newCard.id]);
          this.authService.isActiiveBtn$.next(true);
        })
      )
      .subscribe();
  }
}