import {
  Injectable,
  Logger,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationOptions, authenticate } from 'ldap-authentication';
import { EmployeeAuthLDAP } from 'src/auth/employee.interface';

@Injectable()
export class LdapEmployee {
  constructor(private readonly cfg: ConfigService) {}

  private getOptions(): AuthenticationOptions {
  return {
    ldapOpts: {
      url: this.cfg.getOrThrow<string>('LDAP_EMPLOYEE_URL'),
      timeout: 5000,
      connectTimeout: 3000,
    },
    adminDn: this.cfg.getOrThrow<string>('LDAP_EMPLOYEE_ADMIN_DN'),
    adminPassword: this.cfg.getOrThrow<string>('LDAP_EMPLOYEE_ADMIN_PASS'),
    userSearchBase: this.cfg.getOrThrow<string>('LDAP_EMPLOYEE_SEARCH_BASE'),
    usernameAttribute: this.cfg.getOrThrow<string>('LDAP_EMPLOYEE_USERNAME_ATTRIB'),
  };
}

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
        ...this.getOptions(),
        username,
        userPassword,
        attributes: returnedAttributes,
      });
      return user;
    } catch (error) {
      Logger.log(error);

      const errorMessage = error.admin?.lde_message || error.message || '';
      const isInvalidCredentials =
        error.code === 49 ||
        error.statusCode === 49 ||
        errorMessage.toLowerCase().includes('invalid credentials') ||
        errorMessage.toLowerCase().includes('invalidcredentialserror') ||
        errorMessage.toLowerCase().includes('data 52e');

      if (isInvalidCredentials) {
        throw new UnauthorizedException('Wrong username or password.');
      }

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

      throw new HttpException(
        `Authentication server failed: ${errorMessage}`,
        503,
      );
    }
  }
}