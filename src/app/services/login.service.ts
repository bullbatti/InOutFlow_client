import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  loginUrl = `${this.BASEURL}/login`;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Performs a login operation by sending a POST request to the API endpoint.
   *
   * @param login The login information provided by the user.
   * @return An observable of the HTTP response, allowing asynchronous handling of the response.
   */
  login(login: Login) {
    const headers = this.getPostHeaders();

    return this.http.post(`${this.loginUrl}/`, login, {
      headers,
      observe: 'response'
    });
  }
}
