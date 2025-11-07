import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginCredential } from "../../domain/entities/login.credential";
import { LoginResponseInterface } from "../interfaces/login-response.interface";
import { LoginRepository } from "../repository/login-repository";

@Injectable()

export class LoginUseCase {
  private repository = inject(LoginRepository);

    execute(credentials: LoginCredential): Observable<LoginResponseInterface> {
    return this.repository.fetchLogin(credentials);
  }
}