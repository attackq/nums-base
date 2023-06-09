import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  users: any;
  lastUserId: number;
  public newUser: User;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((res) => {
      if (Object.entries(res).length !== 0) {
        this.users = res;
        this.lastUserId = this.users[this.users.length - 1].id;
      }
    });
  }

  registerForm: FormGroup = this.builder.group({
    id: this.builder.control('', Validators.required),
    role: this.builder.control('', Validators.required),
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
    lastName: this.builder.control('', Validators.required),
    createdAt: this.builder.control('', Validators.required),
  });

  registerUser() {
    // this.registerForm.controls['id'].setValue(this.lastUserId + 1);
    // this.registerForm.controls['role'].setValue('stuff');
    // this.registerForm.controls['createdAt'].setValue(Date.now());
    // const newUser = {
    //   id: this.registerForm.value.id,
    //   role: this.registerForm.value.role,
    //   username: this.registerForm.value.username.toLowerCase(),
    //   password: this.registerForm.value.password,
    //   lastName: this.registerForm.value.lastName.toLowerCase(),
    //   createdAt: this.registerForm.value.createdAt,
    // };
    // this.authService
    //   .getUserByUsername(this.registerForm.value.username.toLowerCase())
    //   .pipe(
    //     filter((val: any) => [val].length !== 0),
    //     switchMap((val: any) => {
    //       console.log(val);
    //     })
    //   )
    //   .subscribe();
    // .pipe(
    //   tap((val) => {
    //     if (Object.entries(val).length === 0) {
    //       if (this.registerForm.valid) {
    //         this.authService
    //           .registerUser(this.newUser))
    //           .subscribe((res) => {
    //             this.toastr.success('Registered Successfully');
    //             this.router.navigate(['']);
    //           });
    //       } else {
    //         this.toastr.error('Invalid Data');
    //       }
    //     } else {
    //       this.toastr.error('User already exists');
    //     }
    //   })
    // )
    // .subscribe();
  }
}
