import { Injectable } from '@angular/core';
import {
    LoginDataApiDto,
    LoginSessionApiDto,
    TwoFactorChallengeApiDto,
} from '@presentation/pages/authentication/infrastructure/api/dto/login/login-response-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import {
    LoginResponseEntity,
    TwoFactorChallenge,
} from '@presentation/pages/authentication/domain/entities/login/login-response.entity';

@Injectable({ providedIn: 'root' })
export class LoginResponseMapper extends SimpleResponseMapper<
    LoginResponseEntity,
    LoginDataApiDto
> {
    protected mapItemFromDto(dto: LoginDataApiDto): LoginResponseEntity {
        if (this.isTwoFactorChallenge(dto)) {
            const challengeDto = dto as TwoFactorChallengeApiDto;
            const challenge: TwoFactorChallenge = {
                expiredAt: challengeDto.expired_at,
                timeout: challengeDto.timeout,
            };
            return new LoginResponseEntity({
                requiresTwoFactor: true,
                challenge,
            });
        }

        const session = dto as LoginSessionApiDto;
        return new LoginResponseEntity({
            requiresTwoFactor: false,
            token: session.token,
            user: {
                ...session.user,
                enable2fa: session.user.two_fa?.enabled ?? false,
            },
            message: session.message,
        });
    }

    private isTwoFactorChallenge(dto: LoginDataApiDto): boolean {
        return (dto as { requires_2fa?: boolean }).requires_2fa === true;
    }
}
