import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Company } from '../interfaces/company';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseService {
  companyUrl: string = `${this.BASEURL}/companies`;

  constructor(private http: HttpClient) {
    super();
  }

  getAll() {
    const headers = this.getHeaderParams();
    return this.http.get<Company[]>(`${this.companyUrl}/`, { headers });
  }

  getByLoggedEmployee() {
    const headers = this.getHeaderParams();

    return this.http.get<Company>(`${this.companyUrl}/employee`, { headers })
  }

  addNew(company: Company) {
    const headers = this.getPostHeaders();

    return this.http.post<Company[]>(`${this.companyUrl}/new`, company, {
      headers,
    });
  }

  modify(company: Company) {
    const headers = this.getPostHeaders();

    return this.http.put<Company[]>(`${this.companyUrl}/modify`, company, {
      headers,
    });
  }

  deleteSelected(companies: Company[]) {
    const headers = this.getHeaderParams();

    const options = {
      headers,
      body: companies,
    };

    return this.http.delete<Company[]>(`${this.companyUrl}/delete`, options);
  }

  getByMessage(message: Message) {
    const headers = this.getPostHeaders();

    return this.http.post<Company>(`${this.companyUrl}/message`, message, {headers});
  }
}
