import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Card, CardNumber, NewNumber } from '../service/number.interface';
import { User } from '../service/user.interface';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-newnumber-popup',
  templateUrl: './newnumber-popup.component.html',
  styleUrls: ['./newnumber-popup.component.css'],
})
export class NewnumberPopupComponent implements OnInit {
  public currentUser: User | null;
  public currentUrl: string;
  public lastNumberId: number;
  public cardData: CardNumber[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  addNumberForm: FormGroup = this.fb.group({
    id: this.fb.control('', Validators.required),
    title: this.fb.control('', Validators.required),
    product: this.fb.control('', Validators.required),
    creator: this.fb.control('', Validators.required),
  });

  ngOnInit(): void {
    this.currentUrl = this.router.url.slice(-6);

    this.authService.user$
      .pipe(
        tap((user: User | null) => (this.currentUser = user)),
        switchMap(() => {
          return this.authService.getCardById(this.currentUrl).pipe(
            tap((res: Card) => {
              console.log(res);
              this.cardData = res.data;
              console.log(this.cardData);
              this.lastNumberId = +res.data[res.data.length - 1].id + 1;
              this.addNumberForm.controls['id'].setValue(this.lastNumberId);
              this.addNumberForm.controls['creator'].setValue(
                this.currentUser?.lastName
              );
            })
          );
        })
      )
      .subscribe();
  }

  addNumber() {
    if (this.addNumberForm.valid) {
      const number: CardNumber = {
        title: this.addNumberForm.value.title,
        id: this.lastNumberId,
        product: this.addNumberForm.value.product,
        creatorName: this.addNumberForm.value.creator,
        createdAt: Date.now(),
      };
      this.cardData.push(number);
      const newNumber: NewNumber = {
        data: this.cardData,
      };
      this.authService
        .addNumberToCard(this.currentUrl, newNumber)
        .subscribe((res) => {
          this.dialog.closeAll();
          this.toastr.success('Номер добавлен!');
        });
    } else {
      this.toastr.error('Заполните данные данные.');
    }
  }
}
