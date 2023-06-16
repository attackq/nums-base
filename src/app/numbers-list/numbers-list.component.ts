import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../service/user.interface';
import { AuthService } from '../service/auth.service';
import { Observable, map, startWith, switchMap, tap } from 'rxjs';
import { Number } from '../service/number.interface';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NewcardPopupComponent } from '../newcard-popup/newcard-popup.component';

@Component({
  selector: 'app-numbers-list',
  templateUrl: './numbers-list.component.html',
  styleUrls: ['./numbers-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NumbersListComponent implements OnInit {
  public currentUser: User | null;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  isActive: boolean;
  newCardName: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        tap((val: User | null) => {
          this.currentUser = val;
        }),
        switchMap(() =>
          this.authService.isActiiveBtn$.pipe(
            tap((res) => (this.isActive = res))
          )
        ),
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
      map((value) => this._filter(value || '')),
      tap((val) => {
        if (this.myControl.value?.length === 6 && val.length === 0) {
          this.toastr.warning(
            'Группа отсутствует! Зарегестрируйте новую группу.'
          );
          this.newCardName = this.myControl.value;
          this.isActive = !this.isActive;
        } else {
          this.isActive = true;
        }
      })
    );
  }

  showTable(id: string) {
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  navigate() {
    this.router.navigate(['/numbers']);
  }

  openNewCardDialog() {
    let dialogRef = this.dialog.open(NewcardPopupComponent, {
      data: { cardId: this.newCardName },
    });
    // dialogRef
    //   .afterClosed()
    //   .pipe(tap(() => this.authService.isActiiveBtn$.next(false)))
    //   .subscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
