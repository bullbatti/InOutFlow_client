import { Component } from '@angular/core';
import { EmployeeToModifyService } from '../../services/employee-to-modify.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarToModifyComponent } from "../calendar-to-modify/calendar-to-modify.component";
import { Employee } from '../../interfaces/employee';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { SmartCardService } from '../../services/smart-card.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageServerService } from '../../services/message-server.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-to-modify',
  standalone: true,
  imports: [
    CalendarToModifyComponent,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './employee-to-modify.component.html',
  styleUrl: './employee-to-modify.component.css',
})
export class EmployeeToModifyComponent {
  employee!: Employee;
  headerTitle: string = '';
  smartCardId: string = '';
  isEditing: boolean = false;

  constructor(
    private employeeService: EmployeeToModifyService,
    private smartCardService: SmartCardService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employee = this.employeeService.getEmployee();

    this.smartCardService.getIdByEmployee(this.employee).subscribe({
      next: (resp: string) => {
        this.smartCardId = resp;
      },
      error: (err: Error) => {
        console.log(err);
      },
    });

    this.headerTitle = `${this.employee.firstName} ${this.employee.lastName}'s data`;
  }

  inEditing() {
    this.isEditing = true;
  }

  exitEditing() {
    this.isEditing = false;
  }

  save() {
    this.smartCardService.update(this.employee, this.smartCardId).subscribe({
      next: () => {
        this.exitEditing();
        this.messageService.add({
          severity: 'success',
          summary: "Success",
          detail: "Smartcard modified successfully"
        });
      },
      error: () => {
         this.messageService.add({
           severity: 'error',
           summary: 'Error',
           detail: 'Error while modifying smart card, please try again or contact techincal support',
         });
      }
    })
  }
}
