import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewnumberPopupComponent } from '../newnumber-popup/newnumber-popup.component';

@Component({
  selector: 'app-selected-number',
  templateUrl: './selected-number.component.html',
  styleUrls: ['./selected-number.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectedNumberComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Number[]>;

  displayedColumns: string[] = [
    'id',
    'title',
    'product',
    'creator',
    'date',
    'actions',
  ];
  dataSource: MatTableDataSource<Number>;
  currentUser: User | null;
  isShowTable: boolean = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          return this.authService.getCardById(params['id']).pipe(
            tap((number: any) => {
              const n = number.data.filter((i: any) => i.id !== 0);
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

  addNumberToCard() {
    let dialog = this.dialog.open(NewnumberPopupComponent);
  }
}
