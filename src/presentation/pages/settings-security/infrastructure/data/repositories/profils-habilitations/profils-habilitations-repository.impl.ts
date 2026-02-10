import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-create.entity';
import { ProfilsHabilitationsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-filter.entity';
import { ProfilsHabilitationsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-update.entity';
import { ProfilsHabilitationsEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations.entity';
import { ProfilsHabilitationsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-repository';
import { profilsHabilitationsCreateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-create.mapper';
import { profilsHabilitationsFilterMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-filter.mapper';
import { profilsHabilitationsUpdateMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations-update.mapper';
import { ProfilsHabilitationsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/profils-habilitations/profils-habilitations.mapper';
import { ProfilsHabilitationsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/profils-habilitations/profils-habilitations.api';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsRepositoryImpl implements ProfilsHabilitationsRepository {
    private readonly api = inject(ProfilsHabilitationsApi);
    private readonly mapper = inject(ProfilsHabilitationsMapper);

    readAll(
        filter: ProfilsHabilitationsFilterEntity,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsEntity>> {
        const paramsDto = profilsHabilitationsFilterMapper(filter);
        return this.api
            .readAll(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: ProfilsHabilitationsCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilsHabilitationsCreateMapper(payload);
        return this.api.create(paramsDto);
    }

    update(
        payload: ProfilsHabilitationsUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        const paramsDto = profilsHabilitationsUpdateMapper(payload);
        return this.api.update(paramsDto);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.api.delete(code);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.disable(id);
    }
}
