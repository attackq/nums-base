import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import '@angular/common/locales/global/ru';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { UserslistComponent } from './userslist/userslist.component';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NumbersListComponent } from './numbers-list/numbers-list.component';
import { SelectedNumberComponent } from './selected-number/selected-number.component';
import { NewcardPopupComponent } from './newcard-popup/newcard-popup.component';
import { MatCardModule } from '@angular/material/card';
import { NewnumberPopupComponent } from './newnumber-popup/newnumber-popup.component';
import { ApprovePopupComponent } from './approve-popup/approve-popup.component';
import { MatSortModule } from '@angular/material/sort';
import { FormatIdPipe } from './service/formatid.pipe';
import { CustomPaginator } from './service/CustomPaginatorConfiguration';
import {
  ReCaptchaV3Service,
  RecaptchaModule,
  RecaptchaV3Module,
} from 'ng-recaptcha';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserslistComponent,
    DeletePopupComponent,
    EditUserComponent,
    NumbersListComponent,
    SelectedNumberComponent,
    NewcardPopupComponent,
    NewnumberPopupComponent,
    ApprovePopupComponent,
    FormatIdPipe,
    FeedComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RecaptchaModule,
    RecaptchaV3Module,
    MatSortModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      maxOpened: 4,
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LdHShYnAAAAAEC8KLL1DZ-bvNEyYSJI1B40IUM3',
    },
    {
      provide: MatDialogRef,
      useValue: {},
    },
    FormatIdPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
