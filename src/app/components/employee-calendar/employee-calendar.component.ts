import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { Employee } from '../../interfaces/employee';
import { Tracking } from '../../interfaces/tracking';
import { TrackingService } from '../../services/tracking.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-employee-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DialogModule,
    CommonModule,
  ],
  templateUrl: './employee-calendar.component.html',
  styleUrl: './employee-calendar.component.css',
})
export class EmployeeCalendarComponent implements OnInit {
  @Input() employee!: Employee;
  @ViewChild(FullCalendarComponent) fullCalendar!: FullCalendarComponent;

  fullDate: any;
  selectedDate: any;
  visible: boolean = false;
  eventDetails!: any;
  startTitle: string = '';
  endtitle: string = '';

  calendarOptions: CalendarOptions = {
    themeSystem: 'standard',
    initialView: 'timeGridDay',
    height: '100%',
    plugins: [timeGridPlugin, dayGridPlugin],
    dayHeaders: false,
    dayHeaderContent: false,
    nowIndicator: true,
    expandRows: true,
    allDaySlot: false,
    headerToolbar: false,
    slotDuration: '01:00:00',
    editable: true,
    eventMinHeight: 50,
    eventContent: this.renderEventContent,
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private trackingService: TrackingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getEventsByDate(new Date());
  }

  /**
   * Fetches events for a given date from the tracking service.
   * Ensures that only past or current events are retrieved, preventing future fake data from being visible.
   * If the events are successfully retrieved, they are processed and assigned to the calendar options.
   * If an event title does not include 'EXIT', it is assigned a specific color.
   * If there is an error during the data retrieval, an error message is displayed to the user.
   *
   * @param date - The date for which to fetch events.
   */
  getEventsByDate(date: Date) {
    // prevents future fake data to be visible
    if (date <= new Date()) {
      this.trackingService.getEventsByDate(date).subscribe({
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error while retrieving calendar informations, please refresh the page or contact the technical support',
          });
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
    this.visible = true;
    this.getEventTitle(this.eventDetails.title);
  }

  /**
   * Process the received events and update the calendar array.
   * Divides the title in two rows in order to divide the entry and the exit tracking titles.
   *
   * @param t tracking event received from the server
   * @returns
   */
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
}
