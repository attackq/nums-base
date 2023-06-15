import { Component, OnInit, ViewChild } from '@angular/core';
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
export class NumbersListComponent implements OnInit {
  public currentUser: User | null;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        tap((val: User | null) => {
          this.currentUser = val;
        }),
        switchMap(() => {
          return this.authService.getAllNumbers().pipe(
            tap((nums: Number[]) => {
              nums.map((num: Number) => this.options.push(num.id));
            })
          );
        })
      )
      .subscribe();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  showTable(id: string) {
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
