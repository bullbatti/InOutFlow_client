import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Employee } from '../../interfaces/employee';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { EmployeeService } from '../../services/employee.service';
import { Table, TableCheckbox, TableModule } from 'primeng/table';
import { NewEmployee } from '../../interfaces/new-employee';
import { AccountType } from '../../enums/account-type';
import { EmployeeToModifyService } from '../../services/employee-to-modify.service';
import { SmartCardService } from '../../services/smart-card.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';

@Component({
  selector: 'app-employee-company',
  standalone: true,
  imports: [
    ToastModule,
    TabViewModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-company.component.html',
  styleUrl: './employee-company.component.css',
})
export class EmployeeCompanyComponent {
  @ViewChild('dt') dt: Table | undefined;

  employee!: Employee;
  company!: Company;
  employees!: Employee[];
  newEmployee!: NewEmployee;
  employeeToModify!: Employee;
  selectedEmployees!: Employee[];
  submitted: boolean = false;
  newEmployeeDialog: boolean = false;
  modifyDialog: boolean = false;
  statuses!: any[];
  accountTypes = [
    { name: 'ADMINISTRATOR', code: AccountType.ADMINISTRATOR },
    { name: 'SUPPORT', code: AccountType.SUPPORT },
    { name: 'USER', code: AccountType.USER },
  ];

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private employeeToModifyService: EmployeeToModifyService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    /**
     * Fetches the user information from the server.
     * Makes use of the employeeService to send a request to the server to fetch
     * the details of the employee. Upon receiving a successful response, it assigns the response
     * to the employee object and navigates to the user's profile page. If an error occurs,
     * particularly when the token has expired, it logs the error message and hides the display message.
     */
    this.employeeService.getEmployee().subscribe({
      next: (resp: Employee) => {
        this.employee = resp;
      },
      error: (err: HttpErrorResponse) => {
        this.router.navigateByUrl('/employee');
      },
    });

    this.companyService.getByLoggedEmployee().subscribe({
      next: (res: Company) => {
        this.company = res;
      },
      error: (err: Error) => {
        console.error(err);
      }
    });

    this.employeeService.getAllByMyCompany().subscribe({
      next: (res: Employee[]) => {
        this.employees = res;
      },
      error: (err: Error) => {
        if (err.message.includes('token')) {
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error while retrieving employees data, please reload the page or contact the techincal support',
          });
        }
      },
    });
  }

  openNew() {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      accountType: AccountType.USER,
      emailAddress: '',
      birthDate: new Date(),
      phoneNumber: '',
      smartCardNumber: '',
    };

    this.submitted = false;
    this.newEmployeeDialog = true;
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt && inputElement) {
      const value = inputElement.value;
      this.dt.filterGlobal(value, 'contains');
    }
  }

  hideDialog() {
    this.newEmployeeDialog = false;
    this.modifyDialog = false;
    this.submitted = false;
  }

  saveEmployee(employee: NewEmployee) {
    this.employeeService.addNewEmployee(employee, this.company).subscribe({
      next: (resp: Employee[]) => {
        this.updateTable(resp);
        this.newEmployeeDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee saved successfully',
        });
      },
      error: (err: Error) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while saving employee, please try again',
        });
      },
    });

    this.submitted = true;
  }

  modifyEmployee(employee: Employee) {
    this.employeeService.modifyEmployee(employee).subscribe({
      next: (resp: Employee[]) => {
        this.updateTable(resp);
        this.modifyDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee modified successfully',
        });
      },
      error: (err: Error) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while modifying employee, please try again',
        });
      },
    });

    this.submitted = true;
  }

  openEditEmployee(event: MouseEvent, employee: Employee) {
    this.employeeToModify = employee;
    event.stopPropagation();
    this.submitted = false;
    this.modifyDialog = true;
  }

  deleteSelectedEmployees(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.employeeService
          .deleteSelectedEmployees(this.selectedEmployees)
          .subscribe({
            next: (resp: Employee[]) => {
              this.updateTable(resp);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employees deleted successfully',
              });
            },
            error: (err: Error) => {
              console.error(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting employees, please try again',
              });
            },
          });
      },
      reject: () => {},
    });
  }

  deleteEmployee(event: Event, employee: Employee) {
    event.stopPropagation();
    this.selectedEmployees = [];
    this.selectedEmployees.push(employee);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.employeeService
          .deleteSelectedEmployees(this.selectedEmployees)
          .subscribe({
            next: (resp: Employee[]) => {
              this.updateTable(resp);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Employee deleted successfully',
              });
            },
            error: (err: Error) => {
              console.log(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting employee, please try again',
              });
            },
          });
      },
      reject: () => {
        this.selectedEmployees = [];
      },
    });
  }

  updateTable(resp: any) {
    this.employees = resp;

    //doesn't show logged user row
    this.employees = this.employees.filter(
      (t) => t.rollNumber !== this.employee.rollNumber
    );
  }

  routeEmployeeData(employee: Employee) {
    this.employeeToModifyService.setEmployee(employee);
    this.router.navigate(['/employee/my-company/edit-employee-data']);
  }
}
