import { Component, Input, OnInit } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Form } from '../../interfaces/form';
import { MessageType } from '../../enums/message-type';
import { MessageServerService } from '../../services/message-server.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-support-forms',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    InputTextareaModule,
    TabViewModule,
    ButtonModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './support-forms.component.html',
  styleUrl: './support-forms.component.css',
})
export class SupportFormsComponent implements OnInit {
  @Input() employee!: Employee;

  internalSupportForm!: FormGroup;
  administratorSupportForm!: FormGroup;
  sendForm!: Form;

  constructor(
    private messageServerService: MessageServerService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.internalSupportForm = this.fb.group({
      emailAddress: [
        { value: this.employee.emailAddress, disabled: true },
        [Validators.required, Validators.email],
      ],
      description: ['', Validators.required],
      type: [MessageType.INTERNAL_SUPPORT, [Validators.required]],
    });

    this.administratorSupportForm = this.fb.group({
      emailAddress: [
        { value: this.employee.emailAddress, disabled: true },
        [Validators.required, Validators.email],
      ],
      description: ['', Validators.required],
      type: [MessageType.ADMINISTRATOR_SUPPORT, [Validators.required]],
    });
  }

  sendMessage(form: Form) {
    this.messageServerService.send(form).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message sent',
        });
      },
      error: (err: Error) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error while sending message, please fill out again the form.',
        });
      },
    });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      console.log('Form Submitted', form.value);

      this.sendForm = form.getRawValue();
      this.sendMessage(this.sendForm);
      form.reset();

      form.get('emailAddress')?.setValue(this.employee.emailAddress);
      form.get('emailAddress')?.disable();
    }
  }
}
