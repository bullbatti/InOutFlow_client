import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  BASEURL: string = 'http://localhost:8080/inoutflow/api';

  constructor() {}

  /**
   * Retrieves the token from local storage.
   *
   * @return A string containing the token, or an empty string if no token is found.
   */
  getToken() {
    return localStorage.getItem('token') ?? '';
  }

  /**
   * Creates HTTP headers for a POST request.
   * This method initializes a new HttpHeaders object with the 'Content-Type' header set to 'application/json'
   * and the 'Authorization' header set to the token retrieved by the `getToken` method.
   *
   * @return An HttpHeaders object with the 'Content-Type' and 'Authorization' headers set.
   */
  getPostHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.getToken(),
    });
  }

  /**
   * Creates HTTP headers with an authorization token.
   *
   * This method retrieves the token using the `getToken` method and initializes a new HttpHeaders object
   * with the 'Authorization' header set to the retrieved token.
   *
   * @return An HttpHeaders object with the 'Authorization' header set to the token.
   */
  getHeaderParams() {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: token,
    });
  }

  getHeaderParamsToSave() {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token,
      'Content-Type': 'text/plain',
    });
  }
}
