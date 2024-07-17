import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../interfaces/employee';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CompanyToModifyService } from '../../services/company-to-modify.service';

@Component({
  selector: 'app-employee-all-companies',
  standalone: true,
  imports: [
    ToastModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    InputNumberModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employee-all-companies.component.html',
  styleUrl: './employee-all-companies.component.css',
})
export class EmployeeAllCompaniesComponent {
  @ViewChild('dt') dt: Table | undefined;

  employee!: Employee;
  selectedCompanies: any;
  companies: Company[] = [];
  company!: Company;
  newCompany!: Company;
  companyDialog: boolean = false;
  companyModifyDialog: boolean = false;
  submitted: boolean = false;
  employeeCompany!: Company;

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private companyToModifyService: CompanyToModifyService
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
        this.employeeCompany = res;
      },
      error: (err: Error) => {
        console.log(err);
      }
    })

    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companyService.getAll().subscribe({
      next: (resp: Company[]) => {
        this.updateTable(resp);
      },
      error: (err: Error) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while retrieving information, please reload the page or contact the thecnical support',
        });
      },
    });
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt && inputElement) {
      const value = inputElement.value;
      this.dt.filterGlobal(value, 'contains');
    }
  }

  openNew() {
    this.companyDialog = true;

    this.newCompany = {
      businessName: '',
      officeAddress: '',
      emailAddress: '',
      phoneNumber: '',
    };
  }

  modify(company: Company) {
    this.companyModifyDialog = true;
    this.newCompany = company;
  }

  saveCompany(company: Company) {
    this.companyService.addNew(company).subscribe({
      next: (res: Company[]) => {
        this.companyDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company saved successfully',
        });
        this.updateTable(res);
      },
      error: (err: Error) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while saving informations, please try again or contact the thecnical support',
        });
      },
    });
  }

  modifyCompany(company: Company) {
    this.companyService.modify(company).subscribe({
      next: (res: Company[]) => {
        this.companyModifyDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Company modified successfully',
        });
        this.updateTable(res);
      },
      error: (err: Error) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while modifying company, please try again or contact the thecnical support',
        });
      },
    });
  }

  deleteSelectedCompanies(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.companyService.deleteSelected(this.selectedCompanies).subscribe({
          next: (resp: Company[]) => {
            this.updateTable(resp);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Companies deleted successfully',
            });
          },
          error: (err: Error) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while deleting companies, please try again',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  deleteComapny(company: Company, event: Event) {
    this.selectedCompanies = [];
    this.selectedCompanies.push(company);

    this.deleteSelectedCompanies(event);
  }

  updateTable(resp: any) {
    this.companies = resp;
  }

  hideDialog() {
    this.companyDialog = false;
    this.companyModifyDialog = false;
    this.submitted = false;
  }

  routeCompanyData(company: Company) {
    if (company.emailAddress === this.employeeCompany.emailAddress) {
      this.router.navigate(['/employee/my-company']);
    } else {
      this.companyToModifyService.setCompany(company);
      this.router.navigate(['/employee/companies/edit-company-data']);
    }
  }
}
