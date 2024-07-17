import { Injectable } from '@angular/core';
import { Company } from '../interfaces/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyToModifyService {
  _company!: Company;

  constructor() {}

  /**
   * Retrieves the company object to be modified.
   *
   * @return The company object.
   */
  getCompany() {
    return this._company;
  }

  /**
   * Sets the company object to be modified.
   * This method assigns the provided company object to the `_company` property.
   *
   * @param company The company object to be modified.
   */
  setCompany(company: Company) {
    this._company = company;
  }
}
