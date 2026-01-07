import { Observable } from 'rxjs';
import { ChangePasswordRequestDto } from '../../data/dtos/change-password-request.dto';
import { UpdateProfileRequestDto } from '../../data/dtos/update-profile-request.dto';
import { LogoutEntity } from '../entities/logout.entity';

export abstract class MyAccountRepository {
    abstract fetchLogout(): Observable<LogoutEntity>;

    abstract updatePassword(
        payload: ChangePasswordRequestDto
    ): Observable<void>;

    abstract updateProfile(
        payload: UpdateProfileRequestDto
    ): Observable<void>;
}
