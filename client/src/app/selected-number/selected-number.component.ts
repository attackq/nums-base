import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewnumberPopupComponent } from '../newnumber-popup/newnumber-popup.component';
import { Card, CardNumber, NewNumber } from '../service/number.interface';
import { ToastrService } from 'ngx-toastr';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { ApprovePopupComponent } from '../approve-popup/approve-popup.component';
import { NumberModelComponent } from '../number-model/number-model.component';

@Component({
  selector: 'app-selected-number',
  templateUrl: './selected-number.component.html',
  styleUrls: ['./selected-number.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectedNumberComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matsort: MatSort;
  @ViewChild(MatTable) table: MatTable<CardNumber>;

  displayedColumns: string[] = [
    'id',
    'title',
    'product',
    'drawing',
    'creator',
    'date',
    'actions',
  ];
  dataSource: MatTableDataSource<CardNumber>;
  currentUser: User | null;
  isShowTable: boolean = false;
  public cardData: CardNumber[];
  public currentCardId: number;
  public newData: NewNumber;
  public newNumberId: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.currentUser = res;
    });
    this.getDataSource();
  }

  getDataSource() {
    this.activatedRoute.params
      .pipe(
        tap((params: Params) => (this.currentCardId = params['id'])),
        switchMap((params: Params) => {
          return this.authService.getCardById(this.currentCardId).pipe(
            tap((card: Card) => {
              const n = card.data.filter((i: CardNumber) => +i.id !== 0);
              this.newNumberId = card.data.length.toString();
              this.dataSource = new MatTableDataSource(n);
              if (this.dataSource.filteredData.length > 0) {
                this.isShowTable = true;
              } else {
                this.isShowTable = false;
              }
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.matsort;
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

  addNumberToCard() {
    let dialogRef = this.dialog.open(NewnumberPopupComponent, {
      data: {
        id: this.newNumberId,
        fn: 'add',
      },
    });
    dialogRef.afterClosed().subscribe(() => this.getDataSource());
  }

  editNumber(id: string) {
    let dialogRef = this.dialog.open(NewnumberPopupComponent, {
      data: { id: id, fn: 'edit' },
    });
    dialogRef.afterClosed().subscribe(() => this.getDataSource());
  }

  openDeleteNumberDialog(id: string) {
    let newNumId;
    switch (id.length) {
      case 1:
        newNumId = '00' + id;
        break;
      case 2:
        newNumId = '0' + id;
        break;
      default:
        newNumId = id;
    }
    let dialogRef = this.dialog.open(ApprovePopupComponent, {
      data: {
        currentCardId: this.currentCardId,
        titleText: 'Удаление номера',
        text: 'номер',
        id: id,
        fn: 'number',
        username: this.currentCardId + '.' + newNumId,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.getDataSource());
  }

  openShowModelDialog(id: number) {
    let dialogRef = this.dialog.open(NumberModelComponent);
    this.navigateToFoo(id);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {
        queryParams: {
          drawing: null,
        },
      });
    });
  }

  navigateToFoo(id: number) {
    this.router.navigate([], {
      queryParams: {
        drawing: id,
      },
      queryParamsHandling: 'merge',
    });
  }
}
