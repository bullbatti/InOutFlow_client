import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { BaseService } from '../services/base.service';
import { Employee } from '../interfaces/employee';
import { NewEmployee } from '../interfaces/new-employee';
import { Company } from '../interfaces/company';
import { Message } from '../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseService {
  employeeUrl = `${this.BASEURL}/employees`;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Retrieves the employee object from the server.
   * This method sends an HTTP GET request to the specified endpoint to fetch the employee object.
   * The request includes necessary headers obtained from the `getHeaderParams` method.
   *
   * @return An Employee object containing the employee data.
   */
  getEmployee() {
    const headers = this.getHeaderParams();

    return this.http.get<Employee>(`${this.employeeUrl}/`, { headers });
  }

  /**
   * Changes the employee's password.
   * This method sends an HTTP PUT request to the specified endpoint to update the employee's password.
   * The request includes necessary headers obtained from the `getHeaderParamsToSave` method and observes the response.
   *
   * @param password The new password to be set for the employee.
   * @return A boolean indicating the success of the password change operation.
   */
  changePassword(password: string) {
    const headers = this.getHeaderParamsToSave();

    return this.http.put<boolean>(`${this.employeeUrl}/password`, password, {
      headers,
      observe: 'response',
    });
  }

  /**
   * Retrieves all employees by company.
   * This method sends an HTTP GET request to the specified endpoint to fetch all employees associated with the company.
   * The request includes necessary headers obtained from the `getHeaderParams` method.
   *
   * @return An array of Employee objects containing the employee data.
   */
  getAllByMyCompany() {
    const headers = this.getHeaderParams();

    return this.http.get<Employee[]>(`${this.employeeUrl}/my-company`, {
      headers,
    });
  }

  /**
   * Adds a new employee.
   * This method sends an HTTP POST request to the specified endpoint to add a new employee.
   * The request includes necessary headers obtained from the `getPostHeaders` method.
   *
   * @param employee The new employee object to be added.
   * @return An array of Employee objects containing the updated list of employees.
   */
  addNewEmployee(employee: NewEmployee, company: Company) {
    const headers = this.getPostHeaders();

    return this.http.post<Employee[]>(`${this.employeeUrl}/`, {employee, company}, {
      headers,
    });
  }

  /**
   * Modifies an existing employee.
   * This method sends an HTTP PUT request to the specified endpoint to update the employee's information.
   * The request includes necessary headers obtained from the `getPostHeaders` method.
   *
   * @param employee The employee object containing updated information.
   * @return An array of Employee objects containing the updated list of employees.
   */
  modifyEmployee(employee: Employee) {
    const headers = this.getPostHeaders();

    return this.http.put<Employee[]>(`${this.employeeUrl}/modify`, employee, {
      headers,
    });
  }

  /**
   * Deletes selected employees.
   * This method sends an HTTP DELETE request to the specified endpoint to remove the selected employees.
   * The request includes necessary headers obtained from the `getHeaderParams` method and the array of employee objects in the request body.
   *
   * @param employees An array of employee objects to be deleted.
   * @return An array of Employee objects containing the updated list of employees.
   */
  deleteSelectedEmployees(employees: Employee[]) {
    const headers = this.getHeaderParams();

    const options = {
      headers,
      body: employees,
    };

    return this.http.delete<Employee[]>(`${this.employeeUrl}/`, options);
  }

  getByCompany(company: Company) {
    const headers = this.getPostHeaders();

    return this.http.post<Employee[]>(
      `${this.employeeUrl}/companies`,
      company,
      {
        headers,
      }
    );
  }

  getByMessage(message: Message) {
    const headers = this.getPostHeaders();

    return this.http.post<Employee>(`${this.employeeUrl}/message`, message, {
      headers,
    });
  }
}
