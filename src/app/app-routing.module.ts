import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserslistComponent } from './userslist/userslist.component';
import { NumbersListComponent } from './numbers-list/numbers-list.component';
import { SelectedNumberComponent } from './selected-number/selected-number.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserslistComponent },
  { path: 'numbers', component: NumbersListComponent },
  {
    path: 'numbers/:id',
    component: NumbersListComponent,
    // children: [{ path: ':id', component: SelectedNumberComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
