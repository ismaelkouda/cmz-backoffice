import { inject, Injectable } from '@angular/core';
import { ResponsibilitiesSelectEntity } from '@pages/settings-security/domain/entities/users/responsibilities-select.entity';
import { ResponsibilitiesSelectRepository } from '@pages/settings-security/domain/repositories/users/responsibilities-select-repository';
import { ResponsibilitiesSelectMapper } from '@pages/settings-security/infrastructure/data/mappers/users/responsibilities-select.mapper';
import { ResponsibilitiesSelectApi } from '@pages/settings-security/infrastructure/data/sources/users/responsibilities-select.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectRepositoryImpl implements ResponsibilitiesSelectRepository {
    private readonly api = inject(ResponsibilitiesSelectApi);
    private readonly mapper = inject(ResponsibilitiesSelectMapper);

    readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectEntity[]> {
        return this.api
            .readAll(options)
            .pipe(map((dto) => this.mapper.mapFromDto(dto)));
    }
}
