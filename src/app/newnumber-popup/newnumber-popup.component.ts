import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Number } from '../service/number.interface';

@Component({
  selector: 'app-newnumber-popup',
  templateUrl: './newnumber-popup.component.html',
  styleUrls: ['./newnumber-popup.component.css'],
})
export class NewnumberPopupComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {}
  lastNumberId: number;
  newNumber: Number;

  addNumberForm: FormGroup = this.fb.group({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
  });

  addNumber() {
    let currentUrl = this.router.url.slice(-6);
    console.log(currentUrl);
    this.authService
      .getCardByIdData(currentUrl)
      .subscribe((res) => console.log(res));
    this.authService
      .getCardById(currentUrl)
      .pipe(
        tap((res: Number) => {
          this.lastNumberId = res.data[res.data.length - 1].id;
        })
      )
      .subscribe();
  }
}
