import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class SmartCardService extends BaseService {
  smartCardUrl = `${this.BASEURL}/smart-cards`;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Retrieves a new SmartCard ID from the server.
   *
   * @return A SmartCard object containing the new SmartCard ID.
   */
  readSmartCardId() {
    const headers = this.getHeaderParams();

    return this.http.get(`${this.smartCardUrl}/read-id`, {
      headers,
      responseType: 'text',
    });
  }

  getIdByEmployee(employee: Employee) {
    const headers = this.getPostHeaders();

    return this.http.post(`${this.smartCardUrl}/id/`, employee, {
      headers,
      responseType: 'text',
    });
  }

  update(employee: Employee, id: string) {
    const headers = this.getPostHeaders();
    const body = {
        employee,
        id,
    }

    return this.http.put(`${this.smartCardUrl}/modify`, body, {headers});
  }
}
