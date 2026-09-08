import {
  Injectable,
  Logger,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationOptions, authenticate } from 'ldap-authentication';
import { EmployeeAuthLDAP } from 'src/auth/employee.interface';


@Injectable()
export class LdapEmployee {
  private options: AuthenticationOptions = {
    ldapOpts: {
      url: `${process.env.LDAP_EMPLOYEE_URL}`,
      timeout: 5000,
      connectTimeout: 3000,
    },
    adminDn: process.env.LDAP_EMPLOYEE_ADMIN_DN,
    adminPassword: process.env.LDAP_EMPLOYEE_ADMIN_PASS,
    userSearchBase: process.env.LDAP_EMPLOYEE_SEARCH_BASE,
    usernameAttribute: process.env.LDAP_EMPLOYEE_USERNAME_ATTRIB,
    userPassword: process.env.LDAP_EMPLOYEE_DEFAULTPASS_ATTRIB,
  };

  async authenticate(
    username: string,
    userPassword: string,
    returnedAttributes: string[] = [
      'dn',
      'uid',
      'sn',
      'givenName',
      'cn',
      'uidNumber',
      'gidNumber',
    ],
  ): Promise<EmployeeAuthLDAP> {
    try {
      const user = await authenticate({
        ...this.options,
        username,
        userPassword,
        attributes: returnedAttributes,
      });
      return user;
    } catch (error) {
      Logger.log(error);

      // 1. Check for specific LDAP error codes or messages indicating bad credentials
      const errorMessage = error.admin?.lde_message || error.message || '';
      const isInvalidCredentials =
        error.code === 49 ||
        error.statusCode === 49 ||
        errorMessage.toLowerCase().includes('invalid credentials') ||
        errorMessage.toLowerCase().includes('invalidcredentialserror') ||
        errorMessage.toLowerCase().includes('data 52e')||
        errorMessage.includes('0x31') ||
        errorMessage.includes('code: 0x31'); // Active Directory specific code for bad password

      if (isInvalidCredentials) {
        throw new UnauthorizedException('Wrong username or password.');
      }

      // 2. Check for common network/connection issues
      const isServerDown =
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ENOTFOUND' ||
        errorMessage.toLowerCase().includes('connect') ||
        errorMessage.toLowerCase().includes('timeout');

      if (isServerDown) {
        throw new HttpException(
          'Authentication server is currently unreachable.',
          503,
        );
      }

      // 3. Fallback for any other unexpected errors
      throw new HttpException(
        `Authentication server failed: ${errorMessage}`,
        503,
      );
    }
  }

}
