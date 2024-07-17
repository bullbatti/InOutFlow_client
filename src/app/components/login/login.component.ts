import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { Login } from '../../interfaces/login';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { InformationMessageComponent } from '../information-message/information-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    InformationMessageComponent,
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    PasswordModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form!: FormGroup;
  isFormSubmitted: boolean = false;
  credentials!: Login;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService
  ) {
    // Initialize the login form with email and password fields, including validation rules
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Handles the submission of the login form.
   *
   * This method first checks if the login form is valid. If it is valid, it marks the form as submitted
   * and ensures all form controls are touched to trigger validation messages if necessary. It then extracts
   * the email and password from the form controls and assigns them to the credentials object for authentication.
   * Finally, it initiates the login process by calling the login() method.
   */
  onSubmit() {
    const isFormValid = this.form.valid;
    this.isFormSubmitted = true;
    this.form.markAllAsTouched();

    if (isFormValid) {
      this.credentials = {
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value,
      };

      this.login();
    }
  }

  /**
   * Calls the login service to send a login request to the server with the provided employeeLog
   * credentials. Upon receiving a response from the server, it checks the response status. If the status
   * is 200 (OK), it extracts the authorization token from the response headers and stores it in the local
   * storage. It then navigates the user to the profile page. If the response status is 401 (Unauthorized),
   * it sets a login error message indicating invalid email or password. For any other error status, it sets
   * a generic error message indicating inability to connect to the server.
   */
  login() {
    this.loginService.login(this.credentials).subscribe({
      next: (resp: HttpResponse<any>) => {
        if (resp.status === 200) {
          const token = resp.headers.get('Authorization');

          if (token) {
            localStorage.setItem('token', token);
            this.router.navigateByUrl('/employee');
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No token found',
            });
            console.error('No token found');
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid email or password, please try again',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to connect to the server, please try again',
          });
        }
      },
    });
  }
}
