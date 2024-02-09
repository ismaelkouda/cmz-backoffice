import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

export abstract class UserRepository {
    abstract login(params: { username: string, password: string }): Observable<UserModel>;
}