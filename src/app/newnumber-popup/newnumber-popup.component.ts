import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { Card, CardNumber, NewNumber } from '../service/number.interface';
import { User } from '../service/user.interface';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

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
  public newData: NewNumber;
  public newId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
      fn: string;
    },
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  addNumberForm: FormGroup = this.fb.group({
    id: this.fb.control('', Validators.required),
    title: this.fb.control('', [
      Validators.required,
      Validators.pattern('^[\u0400-\u04FF]+$'),
    ]),
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
              let currentNum = this.cardData.filter(
                (i) => i.id === this.data.id
              )[0];
              console.log(this.cardData);
              console.log(currentNum);
              if (this.data.fn === 'add') {
                this.addNumberForm.controls['id'].setValue(this.data.id);
                this.addNumberForm.controls['title'].setValue('');
                this.addNumberForm.controls['product'].setValue('');
              } else {
                this.addNumberForm.controls['id'].setValue(this.data.id);
                this.addNumberForm.controls['title'].setValue(currentNum.title);
                this.addNumberForm.controls['product'].setValue(
                  currentNum.product
                );
              }
              this.lastNumberId = +this.data.id + 1;

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
        id: this.data.id,
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
      this.toastr.error('Заполните данные.');
    }
  }

  editNumber() {
    this.authService
      .getCardById(this.currentUrl)
      .pipe(
        map((res: Card) => {
          return res.data.map((i) => {
            if (i.id === this.data.id) {
              const newNumber: CardNumber = {
                title: this.addNumberForm.value.title,
                id: this.data.id,
                product: this.addNumberForm.value.product,
                creatorName: this.addNumberForm.value.creator,
                createdAt: Date.now(),
              };
              return newNumber;
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
          return this.authService.deleteNumber(this.currentUrl, this.newData);
        })
      )
      .subscribe(() => {
        this.dialog.closeAll();
        this.toastr.success('Номер изменен!');
      });
  }
}
