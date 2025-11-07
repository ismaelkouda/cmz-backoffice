import { Observable } from "rxjs";
import { LoginCredential } from "../../domain/entities/login.credential";
import { LoginResponseInterface } from "../interfaces/login-response.interface";

export abstract class LoginRepository {
  abstract fetchLogin(credentials: LoginCredential): Observable<LoginResponseInterface>;
  abstract getCurrentLogin(): Observable<LoginResponseInterface>;
  abstract getLoginLoading(): Observable<boolean>;
}