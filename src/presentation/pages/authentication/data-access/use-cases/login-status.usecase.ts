import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponseInterface } from '../interfaces/login-response.interface';
import { LoginRepository } from '../repository/login-repository';

@Injectable()

export class LoginStatusUseCase {
  private repository = inject(LoginRepository);

  execute(): Observable<LoginResponseInterface> {
    return this.repository.getCurrentLogin();
  }
}