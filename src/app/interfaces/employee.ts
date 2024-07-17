import { AccountType } from '../enums/account-type';

export interface Employee {
  firstName: string;
  lastName: string;
  rollNumber: string;
  accountType: AccountType;
  emailAddress: string;
  changePassword: boolean;
  image: string;
}
