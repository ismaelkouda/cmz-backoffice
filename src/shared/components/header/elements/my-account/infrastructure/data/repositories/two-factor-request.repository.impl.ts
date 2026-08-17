import { map, Observable } from 'rxjs';
import { TwoFactorRequestRepository } from '../../../domain/repositories/two-factor-request.repository';
import { TwoFactorRequestEntity } from '../../../domain/entities/two-factor-request.entity';
import { twoFactorRequestMapper } from '../mappers/two-factor-request.mapper';
import { inject, Injectable } from '@angular/core';
import { MyAccountApi } from '../../api/my-account.api';
import { TwoFactorRequestResultEntity } from '../../../domain/entities/two-factor-request-result.entity';
import { TwoFactorRequestResultMapper } from '../mappers/two-factor-request-result.mapper';

@Injectable({ providedIn: 'root' })
export class TwoFactorRequestRepositoryImpl implements TwoFactorRequestRepository {
    private readonly api = inject(MyAccountApi);
    private readonly mapper = inject(TwoFactorRequestResultMapper);

    execute(
        entity: TwoFactorRequestEntity
    ): Observable<TwoFactorRequestResultEntity> {
        const dto = twoFactorRequestMapper(entity);
        return this.api
            .twoFactorRequest(dto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
