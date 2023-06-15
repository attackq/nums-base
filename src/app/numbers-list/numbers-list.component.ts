import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { AuthService } from '../service/auth.service';
import { Observable, map, startWith, switchMap, tap } from 'rxjs';
import { Number } from '../service/number.interface';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-numbers-list',
  templateUrl: './numbers-list.component.html',
  styleUrls: ['./numbers-list.component.css'],
})
export class NumbersListComponent {
  displayedColumns: string[] = ['id', 'title', 'product', 'creator', 'date'];
  dataSource: MatTableDataSource<any>;
  currentUser: User | null;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  isShown: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        tap((val: User | null) => {
          this.currentUser = val;
        })
        // switchMap(() => {
        //   return this.refreshData();
        // })
      )
      .subscribe();
    this.authService.getAllNumbers().subscribe((res: Number[]) => {
      res.map((num) => {
        this.options.push(num.id);
      });
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  showTable(id: string) {
    console.log('halle');
    this.isShown = !this.isShown;
    return this.authService
      .getNumberById(id)
      .pipe(
        tap((number: Number) => {
          this.dataSource = new MatTableDataSource(number.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.router.navigate(['details', id], { relativeTo: this.route });
        })
      )
      .subscribe();
  }
  navigate() {
    this.router.navigate(['/numbers']);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // refreshData(id: string) {
  //   return this.authService.getNumberById(id).pipe(
  //     tap((number: Number) => {
  //       this.dataSource = new MatTableDataSource(number.data);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     })
  //   );
  // }

  // openEditNumber() {}
  // openDeleteNumber() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
