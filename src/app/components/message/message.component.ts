import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModule } from 'primeng/card';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { Message } from '../../interfaces/message';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageServerService } from '../../services/message-server.service';
import { ToastModule } from 'primeng/toast';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../interfaces/company';
import { Employee } from '../../interfaces/employee';
import { EmployeeToModifyService } from '../../services/employee-to-modify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    AvatarGroupModule,
    DialogModule,
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  @Input() loggedEmployeeCompany!: Company;
  @Input() message!: Message;
  @Output() refreshedList = new EventEmitter<void>();

  images: string[] = [];
  visible: boolean = false;
  company!: Company;

  constructor(
    private serverMessage: MessageServerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private employeeToModifyService: EmployeeToModifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyService.getByMessage(this.message).subscribe({
      next: (res: Company) => {
        this.company = res;
      },
    });
  }

  openDialog() {
    this.visible = true;
  }

  markAsCompleted(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.message.completed = true;
        this.visible = false;

        this.serverMessage.maskAsDone(this.message).subscribe({
          next: (res: Message[]) => {
            this.refreshedList.emit();
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Support marked as done',
              life: 3000,
            });
          },
          error: (err: Error) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while saving changes, please try again',
              life: 3000,
            });
          },
        });
      },
      reject: () => {},
    });
  }

  viewProfile() {

        if (this.company.emailAddress === this.loggedEmployeeCompany.emailAddress) {
          this.employeeService.getByMessage(this.message).subscribe({
            next: (res: Employee) => {
              this.employeeToModifyService.setEmployee(res);
              this.router.navigate(['/employee/my-company/edit-employee-data']);
            },
          });
        } else {
          this.employeeService.getByMessage(this.message).subscribe({
            next: (res: Employee) => {
              this.employeeToModifyService.setEmployee(res);
              this.visible = false;
              this.router.navigate([
                '/employee/companies/edit-company-data/edit-employee-data',
              ]);
            },
          });
        }
  }
}
