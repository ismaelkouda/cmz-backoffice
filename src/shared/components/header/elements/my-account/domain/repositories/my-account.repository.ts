import { Observable } from 'rxjs';
import { LogoutEntity } from '../entities/logout.entity';

export abstract class MyAccountRepository {
    abstract fetchLogout(): Observable<LogoutEntity>;
}
