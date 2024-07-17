import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EmployeeMainComponent } from './components/employee-main/employee-main.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { authGuard } from './guards/auth.guard';
import { EmployeeCompanyComponent } from './components/employee-company/employee-company.component';
import { supportGuard } from './guards/support.guard';
import { EmployeeToModifyComponent } from './components/employee-to-modify/employee-to-modify.component';
import { EmployeeAllCompaniesComponent } from './components/employee-all-companies/employee-all-companies.component';
import { CompanyToModifyComponent } from './components/company-to-modify/company-to-modify.component';


export const routes: Routes = [
  {
    path: 'login',
    title: 'InOutFlow - Login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'employee',
    component: EmployeeMainComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        title: 'InOutFlow - My Profile',
        component: EmployeeProfileComponent,
      },
      {
        path: 'my-company',
        title: 'InOutFlow - My Company',
        component: EmployeeCompanyComponent,
        canActivateChild: [supportGuard],
      },
      {
        path: 'my-company/edit-employee-data',
        title: 'InOutFlow - Edit Employee Data',
        component: EmployeeToModifyComponent,
      },
      {
        path: 'companies',
        title: 'InOutFlow - All Companies',
        component: EmployeeAllCompaniesComponent,
      },
      {
        path: 'companies/edit-company-data',
        title: 'InOutFlow - Edit Employee Data',
        component: CompanyToModifyComponent,
      },
      {
        path: 'companies/edit-company-data/edit-employee-data',
        title: 'InOutFlow - Edit Employee Data',
        component: EmployeeToModifyComponent,
      },
    ],
  },
];
