import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/api/authentication.endpoints';
import { ValidateOtpApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/verify-otp/validate-otp-api.dto';
import { LoginResponseDto } from '@presentation/pages/authentication/infrastructure/api/dto/login/login-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidateOtpApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(dto: ValidateOtpApiDto): Observable<LoginResponseDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.VALIDATE_OTP}`;
        return this.http.post<LoginResponseDto>(url, dto);
    }
}
