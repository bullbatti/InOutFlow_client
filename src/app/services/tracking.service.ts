import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Tracking } from '../interfaces/tracking';
import { Employee } from '../interfaces/employee';
import { em } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root',
})
export class TrackingService extends BaseService {
  trackingUrl = `${this.BASEURL}/tracking`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  /**
   * Retrieves events by date.
   * This method sends an HTTP GET request to the specified endpoint to fetch events for a given date.
   * The request includes necessary headers obtained from the `getHeaderParams` method.
   * The date is formatted using the `formatDate` method.
   *
   * @param date The date for which events are to be retrieved.
   * @return An array of Tracking objects containing the event data for the specified date.
   */
  getEventsByDate(date: Date) {
    const headers = this.getHeaderParams();
    const dateParam = this.formatDate(date);

    return this.httpClient.get<Tracking[]>(`${this.trackingUrl}/${dateParam}`, {
      headers,
    });
  }

  /**
   * Retrieves events to modify by date and employee email.
   * This method sends an HTTP POST request to the specified endpoint to fetch events for a given date and employee email.
   * The request includes necessary headers obtained from the `getHeaderParams` method.
   * The date is formatted using the `formatDate` method.
   *
   * @param date The date for which events are to be retrieved.
   * @param email The email of the employee whose events are to be modified.
   * @return An array of Tracking objects containing the event data for the specified date and employee.
   */
  getEventsToModifyByDate(date: Date, email: string) {
    const headers = this.getHeaderParams();
    const dateParam = this.formatDate(date);

    return this.httpClient.post<Tracking[]>(
      `${this.trackingUrl}/employee-to-modify/${dateParam}`,
      email,
      { headers }
    );
  }

  /**
   * Formats a date object to a specific string format.
   * This method adjusts the date by adding 2 hours and then converts it to an ISO string format,
   * slicing the string to include only the first 19 characters.
   *
   * @param date The date object to be formatted.
   * @return A string representing the formatted date.
   */
  formatDate(date: Date) {
    date.setHours(date.getHours() + 2);
    return date.toISOString().slice(0, 19);
  }

  formatDateMinusOne(date: Date) {
    date.setHours(date.getHours() + 1);
    return date.toISOString().slice(0, 19);
  }

  formatDateNoAdd(date: Date) {
    date.setHours(date.getHours());
    return date.toISOString().slice(0, 19);
  }

  /**
   * Retrieves the percentage data for the last week.
   * This method sends a GET request to the specified tracking URL to fetch
   * an array of percentage values representing data for the last week.
   * The request includes necessary headers obtained from the employee service.
   *
   * @return an Observable containing an array of percentage values for the last week.
   */
  getLastWeekPercentages() {
    const headers = this.getHeaderParams();

    return this.httpClient.get<number[]>(
      `${this.trackingUrl}/last-week-percentages`,
      {
        headers,
      }
    );
  }

  /**
   * Retrieves the percentage data for the current year.
   * This method sends a GET request to the specified tracking URL to fetch
   * an array of percentage values representing data for the current year.
   * The request includes necessary headers obtained from the header parameters.
   *
   * @return an Observable containing an array of percentage values for the current year.
   */
  getCurrentYearPercentages() {
    const headers = this.getHeaderParams();

    return this.httpClient.get<number[]>(
      `${this.trackingUrl}/year-percentages`,
      {
        headers,
      }
    );
  }

  modifyEvent(
    oldTracking: Tracking,
    newTracking: Tracking,
    employee: Employee
  ) {
    const headers = this.getPostHeaders();
    const body = {
      oldTracking: oldTracking,
      newTracking: newTracking,
      employee: employee,
    };

    return this.httpClient.put(`${this.trackingUrl}/modify`, body, {
      headers,
    });
  }

  delete(tracking: Tracking, employee: Employee) {
    const headers = this.getHeaderParams();

    const options = {
      headers,
      body: {
        tracking,
        employee,
      },
    };

    return this.httpClient.delete<Employee[]>(`${this.trackingUrl}/`, options);
  }

  createEvent(tracking: Tracking, employee: Employee) {
    const headers = this.getPostHeaders();

    const body = {
      tracking: tracking,
      employee: employee,
    };

    return this.httpClient.post(`${this.trackingUrl}/new`, body, { headers });
  }
}
