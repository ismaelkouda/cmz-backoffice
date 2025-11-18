import { Injectable } from '@angular/core';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
import { LoginResponseDto } from '@pages/authentication/data/dtos/login-response.dto';
@Injectable({ providedIn: 'root' })
export class AuthSessionMapper {
    mapFromDto(dto: LoginResponseDto): AuthSession {
        if (dto.error || !dto.data) {
            throw new Error(
                dto.message || 'AUTHENTICATION.MESSAGES.ERROR.FAILED'
            );
        }

        const { user, token } = dto.data;
        return {
            user,
            token,
            message: dto.message,
        };
    }
}
