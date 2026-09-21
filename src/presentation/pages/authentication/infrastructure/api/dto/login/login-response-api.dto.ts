import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface LoginSessionApiDto {
    readonly token: AuthToken;
    readonly user: CurrentUser;
    readonly message?: string;
}

export interface TwoFactorChallengeApiDto {
    readonly requires_2fa: true;
    readonly expired_at: string;
    readonly timeout: number;
}

export type LoginDataApiDto = TwoFactorChallengeApiDto | LoginSessionApiDto;

export type LoginResponseDto = SimpleResponseDto<LoginDataApiDto>;
