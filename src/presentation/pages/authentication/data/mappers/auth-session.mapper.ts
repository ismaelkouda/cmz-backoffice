import { Injectable } from '@angular/core';
import { LoginResponseDto } from '@pages/authentication/data/dto/login-response.dto';
import { AuthSession } from '@pages/authentication/domain/entities/auth-session.entity';
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
