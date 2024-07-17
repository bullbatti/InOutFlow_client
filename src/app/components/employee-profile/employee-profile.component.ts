import { Component, OnInit } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EmployeeCalendarComponent } from '../employee-calendar/employee-calendar.component';

import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { SupportFormsComponent } from '../support-forms/support-forms.component';
import { InboxComponent } from '../inbox/inbox.component';
import { ToastModule } from 'primeng/toast';
import { EmployeeService } from '../../services/employee.service';
import { Company } from '../../interfaces/company';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [
    EmployeeCalendarComponent,
    PieChartComponent,
    BarChartComponent,
    InboxComponent,
    SupportFormsComponent,
    ProgressSpinnerModule,
  ToastModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css',
})
export class EmployeeProfileComponent implements OnInit {
  employee!: Employee;
  company!: Company;

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private router: Router,
    private companyservice: CompanyService
  ) {}

  ngOnInit(): void {
    /**
     * Fetches the employee data from the service.
     * If the employee data is successfully retrieved, it is assigned to the `employee` property.
     * If there is an error during the data retrieval, the user is redirected to the employee page.
     */
    this.employeeService.getEmployee().subscribe({
      next: (resp: Employee) => {
        this.employee = resp;
      },
      error: () => {
        this.router.navigateByUrl('/employee');
      },
    });

    this.companyservice.getByLoggedEmployee().subscribe({
      next: (res: Company) => {
        this.company = res;
      },
      error: (err: Error) => {
        console.error(err);
      }
    })
  }
}
