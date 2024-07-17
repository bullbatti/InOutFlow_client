import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountType } from '../enums/account-type';
import { Employee } from '../interfaces/employee';
import { EmployeeService } from '../services/employee.service';

export const administratorGuard: CanActivateFn = (route, state) => {
  /* Services injections */
  const employeeService = inject(EmployeeService);
  const router = inject(Router);

  /**
   * Subscribes to the employee data and performs navigation based on the account type.
   * This method subscribes to the employee data retrieved from the employee service.
   * If the employee's account type is ADMINISTRATOR, it returns true and allows the routing to the component.
   * Otherwise, it navigates to the employee profile page and returns false.
   *
   * @return true if the employee's account type is ADMINISTRATOR, false otherwise.
   */
  employeeService.getEmployee().subscribe((employee: Employee) => {
    if (employee.accountType === AccountType.ADMINISTRATOR) {
      return true;
    } else {
      router.navigateByUrl('/employee/profile');
      return false;
    }
  });

  return false;
};
