import { Injectable, inject } from '@angular/core';
import { ResendDefineResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/resend-define/resend-define-response-api.dto';
import { ResendDefineResponseMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/resend-define/resend-define-response.mapper';
import { ResendDefineApi } from '@presentation/pages/authentication/infrastructure/data/sources/resend-define/resend-define.api';
import { ResendDefineRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/resend-define/resend-define-request.validate-contract';
import { ResendDefineRepository } from '@presentation/pages/authentication/domain/repositories/resend-define/resend-define.repository';
import { ResendDefineResponseEntity } from '@presentation/pages/authentication/domain/entities/resend-define/resend-define-response.entity';
import { resendDefineRequestMapper } from '@presentation/pages/authentication/infrastructure/data/mappers/resend-define/resend-define-request.mapper';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResendDefineRepositoryImpl implements ResendDefineRepository {
    private readonly api = inject(ResendDefineApi);
    private readonly mapper = inject(ResendDefineResponseMapper);

    execute(
        validContract: ResendDefineRequestValidateContract
    ): Observable<ResendDefineResponseEntity> {
        const dto = resendDefineRequestMapper(validContract);
        return this.api
            .execute(dto)
            .pipe(
                map((response: ResendDefineResponseApiDto) =>
                    this.mapper.mapFromDto(response)
                )
            );
    }
}
