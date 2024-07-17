import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../interfaces/message';
import { BaseService } from './base.service';
import { FormGroup } from '@angular/forms';
import { Form } from '../interfaces/form';

@Injectable({
  providedIn: 'root',
})
export class MessageServerService extends BaseService {
  messageUrl: string = `${this.BASEURL}/messages`;

  constructor(private http: HttpClient) {
    super();
  }

  getMessages() {
    const headers = this.getHeaderParams();

    return this.http.get<Message[]>(`${this.messageUrl}/receiver`, { headers });
  }

  maskAsDone(message: Message) {
    const headers = this.getPostHeaders();

    return this.http.put<Message[]>(`${this.messageUrl}/completed`, message, { headers });
  }

  send(form: Form) {
    const headers = this.getPostHeaders();

    return this.http.post(`${this.messageUrl}/new`, form, {
      headers,
    });
  }
}
