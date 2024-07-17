import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MessageComponent } from '../message/message.component';
import { ScrollTopModule } from 'primeng/scrolltop';

import { Message } from '../../interfaces/message';
import { MessageServerService } from '../../services/message-server.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Company } from '../../interfaces/company';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CardModule,
    ScrollTopModule,
    MessageComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
})
export class InboxComponent implements OnInit {
  @Input() company!: Company;

  messages: Message[] = [];

  constructor(
    private messageServerService: MessageServerService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.messageServerService.getMessages().subscribe({
      next: (res: Message[]) => {
        this.messages = res;
      },
      error: (err: Error) => {
        if (err.message.includes('token')) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Token expired, please log in again',
          });

          setTimeout(() => {
            localStorage.removeItem('token');
            this.router.navigateByUrl('');
          }, 3500);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Unable to retieve messages, please reload the page or contact the techinical support',
          });
        }
      },
    });
  }
}
