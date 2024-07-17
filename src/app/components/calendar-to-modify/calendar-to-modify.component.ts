import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { Employee } from '../../interfaces/employee';
import { Tracking } from '../../interfaces/tracking';
import { TrackingService } from '../../services/tracking.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-to-modify',
  standalone: true,
  imports: [
    FullCalendarModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ContextMenuModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './calendar-to-modify.component.html',
  styleUrl: './calendar-to-modify.component.css',
})
export class CalendarToModifyComponent {
  @Input() employee!: Employee;
  @ViewChild(FullCalendarComponent) fullCalendar!: FullCalendarComponent;
  @ViewChild('cm') cm!: ContextMenu;

  fullDate: any;
  selectedDate: any;
  isPrimeNgCalendarInline: boolean = true;
  visible: boolean = false;
  eventDetails!: any;
  startTitle: string = '';
  endtitle: string = '';
  items!: MenuItem[];
  modifyEventDialog: boolean = false;
  createEventDialog: boolean = false;
  oldTracking: Tracking = {
    startDate: '',
    endDate: '',
    nfcReader: '',
  };
  newStartDate!: Date;
  newEndDate!: Date;
  newTracking: Tracking = {
    startDate: '',
    endDate: '',
    nfcReader: '',
  };

  calendarOptions: CalendarOptions = {
    themeSystem: 'standard',
    initialView: 'timeGridDay',
    height: '100%',
    plugins: [timeGridPlugin, dayGridPlugin],
    dayHeaders: false,
    dayHeaderContent: false,
    nowIndicator: true,
    allDaySlot: false,
    expandRows: true,
    headerToolbar: false,
    slotDuration: '01:00:00',
    editable: true,
    eventMinHeight: 50,
    eventContent: this.renderEventContent,
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private messageService: MessageService,
    private trackingService: TrackingService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.selectedDate = new Date();
    this.getEventsByDate(this.selectedDate);

    // PER MODIFICA EVENTI
    this.items = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-eye',
        command: () => this.viewEvent(),
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.editEvent(),
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-times',
        command: () => this.deleteEvent(),
      },
    ];
  }

  /**
   * Fetches events for a specific date and updates the calendar.
   * Uses the trackingService to send a request to the server to fetch
   * events for a given date. Upon receiving a successful response, it processes the event titles
   * to add line breaks after the word "ENTRY" and updates the calendar with the modified events.
   *
   * @param {Date} date - The date for which events are to be fetched.
   */
  getEventsByDate(date: Date) {
    if (date <= new Date()) {
      this.trackingService
        .getEventsToModifyByDate(date, this.employee.emailAddress)
        .subscribe({
          next: (res: Tracking[]) => {
            this.fullDate = res.map((t) => {
              let modifiedTitle = this.getEventTitle(t.nfcReader);

              if (!modifiedTitle.includes('EXIT')) {
                return {
                  title: modifiedTitle,
                  start: t.startDate,
                  end: t.endDate,
                  color: '#9EC4FE',
                };
              }

              return {
                title: modifiedTitle,
                start: t.startDate,
                end: t.endDate,
              };
            });

            this.calendarOptions.events = this.fullDate;
            this.calendarOptions = { ...this.calendarOptions };
          },
          error: (err: Error) => {
            console.log(err);
            if (err.message.includes('')) {
              this.router.navigateByUrl('/employee');
            }
          },
        });
    }
  }

  /**
   * Handles the selection of a date on the calendar.
   * Updates the selected date, fetches events for the selected date,
   * and updates the calendar visualization to reflect the new date and its events.
   *
   * @param {Date} event - The selected date.
   */
  onDateSelect(event: Date) {
    this.selectedDate = event;
    this.calendarOptions.initialDate = this.selectedDate;

    this.getEventsByDate(this.selectedDate);

    if (this.fullCalendar) {
      this.fullCalendar.getApi().gotoDate(this.selectedDate);
    }
  }

  /**
   * Customizes the rendering of event content in the calendar.
   * Creates DOM elements for the event time and title and returns them
   * as nodes to be displayed in the calendar event.
   *
   * @param {Object} arg - The argument object containing time text and event details.
   * @param {string} arg.timeText - The text representing the event time.
   * @param {Object} arg.event - The event object containing event details.
   * @param {string} arg.event.title - The title of the event.
   * @returns {Object} An object containing the DOM nodes for the event content.
   */
  renderEventContent(arg: { timeText: string; event: { title: string } }) {
    // Create the DOM element for the event time
    const timeEl = document.createElement('div');
    timeEl.innerText = arg.timeText;

    // Create the DOM element for the event title with HTML
    const titleEl = document.createElement('div');
    titleEl.innerHTML = arg.event.title;

    // Return the elements as DOM nodes
    return { domNodes: [timeEl, titleEl] };
  }

  /**
   * Handles the click event on a calendar event.
   * Displays an informational message to the user.
   */
  handleEventClick(arg: any) {
    this.eventDetails = undefined;
    this.eventDetails = arg.event;
    this.oldTracking.startDate = this.trackingService.formatDate(
      this.eventDetails.start
    );
    this.oldTracking.endDate = this.trackingService.formatDate(
      this.eventDetails.end
    );

    this.newStartDate = new Date(this.oldTracking.startDate);
    this.newEndDate = new Date(this.oldTracking.endDate);

    // Prevent the default context menu only for this event
    arg.jsEvent.preventDefault();

    // Show PrimeNG context menu at the correct position
    this.cm.show(arg.jsEvent);

    // Stop propagation of the event to avoid other listeners
    if (arg.jsEvent.stopPropagation) {
      arg.jsEvent.stopPropagation();
    }
  }

  getEventTitle(title: string) {
    const entryIndex = title.indexOf('ENTRY');
    let modifiedTitle = title;

    if (entryIndex !== -1) {
      const beforeEntry = title.slice(0, entryIndex + 5); // "ENTRY" è lunga 5 caratteri
      const afterEntry = title.slice(entryIndex + 5);
      this.startTitle = beforeEntry.replace('ENTRY', '');

      if (afterEntry !== '' || afterEntry != null) {
        this.endtitle = afterEntry.replace('EXIT', '');
      }

      modifiedTitle = beforeEntry + '<br>' + afterEntry;
    }

    return modifiedTitle;
  }

  viewEvent() {
    this.visible = true;
  }

  editEvent() {
    this.modifyEventDialog = true;
  }

  deleteEvent() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.trackingService.delete(this.oldTracking, this.employee).subscribe({
          next: () => {
            this.getEventsByDate(this.selectedDate);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Tracking deleted successfully',
            });
          },
          error: (err: Error) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while deleting tracking, please try again',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  modifyEvent() {
    this.newTracking.startDate = this.trackingService.formatDate(
      this.newStartDate
    );
    this.newTracking.endDate = this.trackingService.formatDate(this.newEndDate);

    this.trackingService
      .modifyEvent(this.oldTracking, this.newTracking, this.employee)
      .subscribe({
        next: () => {
          this.modifyEventDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Event data modified successfully',
          });
          this.getEventsByDate(this.selectedDate);
        },
        error: (err: Error) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error while modifying event data, please try again or contact technical support.',
          });
        },
      });
  }

  createEvent() {
    this.createEventDialog = true;
    this.newEndDate = new Date();
  }

  saveEvent() {
    this.newTracking.startDate = this.trackingService.formatDate(
      this.newStartDate
    );
    this.newTracking.endDate = this.trackingService.formatDate(this.newEndDate);

    this.trackingService
      .createEvent(this.newTracking, this.employee)
      .subscribe({
        next: () => {
          this.createEventDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Event data modified successfully',
          });
          this.getEventsByDate(this.selectedDate);
        },
        error: (err: Error) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error while modifying event data, please try again or contact technical support.',
          });
        },
      });
  }

  hideDialog() {
    this.modifyEventDialog = false;
    this.createEventDialog = false;
  }
}
