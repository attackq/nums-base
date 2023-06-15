import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
})
export class SelectedNumberComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params: Params) => {
          return this.authService.getNumberById(params['id']).pipe(
            tap((number: any) => {
              console.log(number);
              this.dataSource = new MatTableDataSource(number.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              // this.router.navigate([
              //   { outlets: { selected: ['number', params['id']] } },
              // ]);
            })
          );
        })
      )
      .subscribe();
    console.log('fasdfndasjfasjf');
  }
  displayedColumns: string[] = ['id', 'title', 'product', 'creator', 'date'];
  dataSource: MatTableDataSource<any>;
  currentUser: User | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
