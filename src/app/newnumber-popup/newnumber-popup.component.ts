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
import { Feed } from '../service/feed.interface';
import { FormatIdPipe } from '../service/formatid.pipe';

interface Product {
  viewValue: string;
}

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
  public feedData: Feed[];
  public feedItem: Feed;
  selectedValue: string;
  groupId: string;

  products: Product[] = [
    { viewValue: 'Восток-3Д' },
    { viewValue: 'Восток-2Д' },
    { viewValue: 'Восток-2Д-Э' },
    { viewValue: 'Роса' },
    { viewValue: 'Роса-РБ-М' },
    { viewValue: 'Гроза-С' },
    { viewValue: 'Гроза-Р' },
    { viewValue: 'Небосклон' },
    { viewValue: 'Панда' },
  ];

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
    private dialog: MatDialog,
    private formatId: FormatIdPipe
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
    this.authService;
    this.currentUrl = this.router.url.slice(-6);
    this.authService.user$
      .pipe(
        tap((user: User | null) => (this.currentUser = user)),
        switchMap(() => {
          return this.authService.getCardById(this.currentUrl).pipe(
            tap((res: Card) => {
              console.log(res);
              this.cardData = res.data;
              this.groupId = res.id;
              let currentNum = this.cardData.filter(
                (i) => i.id === this.data.id
              )[0];
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

  // addNumber() {
  //   if (this.addNumberForm.valid) {
  //     const number: CardNumber = {
  //       title: this.addNumberForm.value.title,
  //       id: this.data.id,
  //       product: this.addNumberForm.value.product,
  //       creatorName: this.addNumberForm.value.creator,
  //       createdAt: Date.now(),
  //     };
  //     this.cardData.push(number);
  //     const newNumber: NewNumber = {
  //       data: this.cardData,
  //     };
  //     this.authService
  //       .addNumberToCard(this.currentUrl, newNumber)
  //       .subscribe((res) => {
  //         this.dialog.closeAll();
  //         this.toastr.success('Номер добавлен!');
  //       });
  //   } else {
  //     this.toastr.error('Заполните данные.');
  //   }
  // }

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
        .pipe(
          tap(() => {
            this.dialog.closeAll();
            this.toastr.success('Номер добавлен!');
          }),
          switchMap(() => {
            return this.authService.getFeed().pipe(
              tap((res: Feed[]) => {
                this.feedData = res;
                let id: number;
                if (res.length === 0) {
                  id = 0;
                } else {
                  id = this.feedData[this.feedData.length - 1].id + 1;
                }
                const formatedId = this.formatId.transform(number.id);
                this.feedItem = {
                  id: id,
                  lastname: this.addNumberForm.value.creator,
                  number: `${this.groupId}.${formatedId}`,
                  title: this.addNumberForm.value.title,
                  data: Date.now(),
                  action: 'добавил',
                };
                this.feedData.push(this.feedItem);
                this.authService.feed$.next(this.feedData);
              }),
              switchMap(() => {
                return this.authService.updateFeed(this.feedItem);
              })
            );
          })
        )
        .subscribe(() => {});
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
