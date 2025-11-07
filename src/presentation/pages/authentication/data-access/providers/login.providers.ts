import { Provider } from '@angular/core';
import { LoginRepository } from '../repository/login-repository';
import { LoginRepositoryImpl } from '../repository/login-repositoryImpl';

export const loginProviders: Provider[] = [
  {
    provide: LoginRepository,
    useClass: LoginRepositoryImpl
  }
];