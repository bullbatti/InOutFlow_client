import { Injectable } from '@angular/core';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeToModifyService {
  _employeeToModify!: Employee;

  constructor() {}

  /**
   * Retrieves the employee object to be modified.
   *
   * @return The employee object.
   */
  getEmployee() {
    return this._employeeToModify;
  }

  /**
   * Sets the employee object to be modified.
   * This method assigns the provided employee object to the `_employeeToModify` property.
   *
   * @param employeeToModify The employee object to be modified.
   */
  setEmployee(employeeToModify: Employee) {
    this._employeeToModify = employeeToModify;
  }
}
