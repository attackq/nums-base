import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css'],
})
export class UserslistComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'username',
    'lastName',
    'date',
    'actions',
  ];
  dataSource: MatTableDataSource<User>;
  currentUser: User | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        tap((val: User | null) => {
          this.currentUser = val;
        }),
        switchMap(() => {
          return this.refreshData();
        })
      )
      .subscribe();
  }

  refreshData() {
    return this.authService.getAllUsers().pipe(
      tap((users: User[]) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDeleteDialog(id: string, username: string) {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      data: { userId: id, username: username },
    });
    dialogRef
      .afterClosed()
      .pipe(switchMap(() => this.refreshData()))
      .subscribe();
  }

  openEditUser(id: string, username: string, lastname: string) {
    let dialogRef = this.dialog.open(EditUserComponent, {
      data: { userId: id, username: username, lastname: lastname },
    });
    dialogRef
      .afterClosed()
      .pipe(switchMap(() => this.refreshData()))
      .subscribe();
  }
}
