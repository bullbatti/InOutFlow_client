import { Component, OnInit } from '@angular/core';
import { InformationMessageComponent } from '../information-message/information-message.component';
import { Employee } from '../../interfaces/employee';
import { HeaderNavBarComponent } from '../header-nav-bar/header-nav-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-main',
  standalone: true,
  imports: [
    InformationMessageComponent,
    HeaderNavBarComponent,
    ProgressSpinnerModule,
    ChangePasswordComponent,
    RouterModule,
  ],
  providers: [MessageService],
  templateUrl: './employee-main.component.html',
  styleUrl: './employee-main.component.css',
})
export class EmployeeMainComponent implements OnInit {
  employee!: Employee;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  /**
   * Initializes the component by fetching the employee data from the service.
   * If the employee data is successfully retrieved and the employee does not need to change their password,
   * the user is navigated to the employee profile page.
   * If there is an error during the data retrieval, appropriate error messages are displayed.
   * If the error is related to an expired token, the user is prompted to log in again.
   * In case of any error, the user is redirected to the login page after a delay of 3.5 seconds.
   */
  ngOnInit() {
    this.employeeService.getEmployee().subscribe({
      next: (resp: Employee) => {
        this.employee = resp;

        if (!this.employee.changePassword) {
          this.router.navigate(['/employee/profile']);
        }
      },
      error: (err: Error) => {
        if (err.message.includes('token')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Token expired, please log in again',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to retrieve data, please log in again',
          });
        }

        // redirects the user to the login page
        setTimeout(() => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('');
        }, 3500);
      },
    });
  }
}
