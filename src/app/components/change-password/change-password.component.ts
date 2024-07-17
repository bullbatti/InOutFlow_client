import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { Employee } from '../../interfaces/employee';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    DialogModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  @Input() employee!: Employee;

  form!: FormGroup;
  isFormSubmitted: boolean = false;
  password: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {
    // Initialize the login form with email and password fields, including validation rules
    this.form = new FormGroup({
      passwordNew: new FormControl('', [Validators.required]),
      passwordRep: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    const isFormValid = this.form.valid;
    this.isFormSubmitted = true;
    this.form.markAllAsTouched();

    if (isFormValid) {
      this.password = this.form.controls['passwordNew'].value;
    }

    this.employeeService.changePassword(this.password).subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigateByUrl('');
    });
  }
}
