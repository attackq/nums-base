import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserslistComponent } from './userslist/userslist.component';
import { NumbersListComponent } from './numbers-list/numbers-list.component';
import { SelectedNumberComponent } from './selected-number/selected-number.component';
import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component';
import { NumberModelComponent } from './number-model/number-model.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserslistComponent },
  { path: 'feed', component: FeedComponent },
  // { path: 'model', component: NumberModelComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'numbers',
    component: NumbersListComponent,
    children: [
      {
        path: 'details/:id',
        component: SelectedNumberComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
