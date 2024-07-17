import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Table, TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AccountType } from '../../enums/account-type';
import { Employee } from '../../interfaces/employee';
import { NewEmployee } from '../../interfaces/new-employee';
import { EmployeeToModifyService } from '../../services/employee-to-modify.service';
import { EmployeeService } from '../../services/employee.service';
import { Company } from '../../interfaces/company';
import { CompanyToModifyService } from '../../services/company-to-modify.service';

@Component({
  selector: 'app-company-to-modify',
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
  templateUrl: './company-to-modify.component.html',
  styleUrl: './company-to-modify.component.css',
})
export class CompanyToModifyComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;

  company!: Company;
  employees: Employee[] = [];
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
    private companyToModifyService: CompanyToModifyService
  ) {}

  ngOnInit() {
    this.company = this.companyToModifyService.getCompany();

    this.employeeService.getByCompany(this.company).subscribe({
      next: (res: Employee[]) => {
        this.employees = res;
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while retrieving emlpoyees informations, please try again or contact thecnical support',
        });
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
      reject: () => {},
    });
  }

  updateTable(resp: any) {
    this.employees = resp;
  }

  routeEmployeeData(employee: Employee) {
    this.employeeToModifyService.setEmployee(employee);
    this.router.navigate(['/employee/companies/edit-company-data/edit-employee-data']);
  }
}
