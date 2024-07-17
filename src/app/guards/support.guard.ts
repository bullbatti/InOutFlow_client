import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { AccountType } from '../enums/account-type';
import { EmployeeService } from '../services/employee.service';

export const supportGuard: CanActivateFn = (route, state) => {
  /* Services injections */
  const employeeService = inject(EmployeeService);
  const router = inject(Router);

  /**
   * Subscribes to the employee data and performs navigation based on the account type.
   * This method subscribes to the employee data retrieved from the employee service.
   * If the employee's account type is not USER, it returns true and allows the access to the component.
   * Otherwise, it navigates to the employee profile page and returns false.
   *
   * @return true if the employee's account type is not USER, false otherwise.
   */
  employeeService.getEmployee().subscribe((employee: Employee) => {
    if (employee.accountType !== AccountType.USER) {
      return true;
    } else {
      router.navigateByUrl('/employee/profile');
      return false;
    }
  });

  return false;
};
