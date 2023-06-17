import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewnumberPopupComponent } from '../newnumber-popup/newnumber-popup.component';
import { Card, CardNumber, NewNumber } from '../service/number.interface';
import { ToastrService } from 'ngx-toastr';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-selected-number',
  templateUrl: './selected-number.component.html',
  styleUrls: ['./selected-number.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectedNumberComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CardNumber>;

  displayedColumns: string[] = [
    'id',
    'title',
    'product',
    'creator',
    'date',
    'actions',
  ];
  dataSource: MatTableDataSource<CardNumber>;
  currentUser: User | null;
  isShowTable: boolean = false;
  public cardData: CardNumber[];
  public currentId: string;
  public newData: NewNumber;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.currentUser = res;
    });
    this.getDataSource();
  }

  getDataSource() {
    this.activatedRoute.params
      .pipe(
        tap((params: Params) => (this.currentId = params['id'])),
        switchMap((params: Params) => {
          return this.authService.getCardById(this.currentId).pipe(
            tap((card: Card) => {
              const n = card.data.filter((i: CardNumber) => +i.id !== 0);
              this.dataSource = new MatTableDataSource(n);
              if (this.dataSource.filteredData.length > 0) {
                this.isShowTable = true;
              } else {
                this.isShowTable = false;
              }
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            })
          );
        })
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteNumber(id: string) {
    this.authService.user$
      .pipe(
        tap((user: User | null) => (this.currentUser = user)),
        switchMap(() => {
          return this.authService.getCardById(this.currentId).pipe(
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
                this.currentId,
                this.newData
              );
            })
          );
        })
      )
      .subscribe(() => {
        this.toastr.success('Номер удален!');
        this.getDataSource();
      });
  }

  addNumberToCard() {
    let dialogRef = this.dialog.open(NewnumberPopupComponent);
    dialogRef.afterClosed().subscribe(() => this.getDataSource());
  }

  openDeleteDialog() {
    this.dialog.open(DeletePopupComponent, {
      data: {
        text: 'Удаление номера',
        id: 'idi',
      },
    });
  }
}
