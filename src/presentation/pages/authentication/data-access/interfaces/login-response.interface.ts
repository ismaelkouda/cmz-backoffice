import { AuthToken, CurrentUser } from '../../../../../shared/interfaces/current-user.interface';

interface UserData {
    token: AuthToken;
    user: CurrentUser;
}

export interface LoginResponseInterface {
    data: UserData;
    error: boolean;
    message: string;
}