import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  users: any;
  lastUserId: number;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((res) => {
      this.users = res;
      this.lastUserId = this.users[this.users.length - 1].id;
    });
  }

  registerForm: FormGroup = this.builder.group({
    id: this.builder.control('', Validators.required),
    role: this.builder.control('', Validators.required),
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required),
    fullName: this.builder.control('', Validators.required),
  });

  registerUser() {
    this.registerForm.controls['id'].setValue(this.lastUserId + 1);
    this.registerForm.controls['role'].setValue('stuff');
    if (this.registerForm.valid) {
      this.authService
        .registerUser(this.registerForm.value)
        .subscribe((res) => {
          this.toastr.success('Registered Successfully');
          this.router.navigate(['login']);
        });
    } else {
      this.toastr.error('Invalid Data');
    }
  }
}
