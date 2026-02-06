import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-create.entity';
import { ProfilsHabilitationsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-filter.entity';
import { ProfilsHabilitationsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-update.entity';
import { ProfilsHabilitationsEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class ProfilsHabilitationsRepository {
    abstract readAll(
        filter: ProfilsHabilitationsFilterEntity | null,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsEntity>>;
    abstract create(
        payload: ProfilsHabilitationsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        payload: ProfilsHabilitationsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(code: string): Observable<SimpleResponseDto<void>>;
    abstract enable(code: string): Observable<SimpleResponseDto<void>>;
    abstract disable(code: string): Observable<SimpleResponseDto<void>>;
}
