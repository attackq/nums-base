import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';

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

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          return this.authService.getNumberById(params['id']).pipe(
            tap((number: any) => {
              const n = number.data.filter((i: any) => i.id !== 0);
              // console.log(n);
              // console.log(number.data);

              this.dataSource = new MatTableDataSource(n);
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

  addData() {
    this.dataSource.data.push();
    this.table.renderRows();
  }

  removeData() {
    this.dataSource.data.pop();
    this.table.renderRows();
  }
}
