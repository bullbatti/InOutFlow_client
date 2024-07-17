import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { MenubarModule } from 'primeng/menubar';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { Employee } from '../../interfaces/employee';
import { Section } from '../../interfaces/section';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AccountType } from '../../enums/account-type';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SmartCardService } from '../../services/smart-card.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header-nav-bar',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    SidebarModule,
    AvatarModule,
    ConfirmDialogModule,
    DialogModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './header-nav-bar.component.html',
  styleUrl: './header-nav-bar.component.css',
})
export class HeaderNavBarComponent implements OnInit {
  @Input() employee!: Employee;
  @ViewChild('sidebar') sidebar!: Sidebar;

  isSidebarVisible: boolean = false;
  sections: Section[] = [];
  button: string = 'width: 100%';
  visible: boolean = false;
  textASmartCard: string = '';

  ADMIN = AccountType.ADMINISTRATOR;
  USER = AccountType.USER;
  SUPPORT = AccountType.SUPPORT;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private smartCardService: SmartCardService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.sections = [
      {
        id: 1,
        link: 'profile',
        name: 'My Profile',
        icon: 'pi pi-user mr-2',
      },
      {
        id: 2,
        link: 'my-company',
        name: 'My Company',
        icon: 'pi pi-building mr-2',
      },
      {
        id: 3,
        link: 'companies',
        name: 'All Companies',
        icon: 'pi pi-objects-column mr-2',
      },
    ];
  }

  readNewSmartCard() {
    this.textASmartCard = '';
    this.visible = true;
    /**
     * Inviare una richiesta server side che attende la lettura di una smartcard e restituisce la stringa equivalente all'id
     */
      this.smartCardService.readSmartCardId().subscribe({
        next: (resp: string) => {
          this.textASmartCard = resp;
        },
        error: (err: Error) => {
          console.error(err);
          this.visible = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'SmartCard unavailable',
          });
        },
      });
  }

  /**
   * Opens a dialog to confirm the log out action.
   * If the employee clicks on the "Yes button" the token in the local storage will be deleted and
   * the application will be redirected on the login component.
   *
   * @param event
   */
  logOut(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to log out?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        localStorage.setItem('token', '');
        this.router.navigateByUrl('');
      },
      reject: () => {},
    });
  }

  /**
   * Closes the sidebar
   *
   * @param e Closing event
   */
  closeCallback(e: Event): void {
    this.sidebar.close(e);
  }
}
