import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';

import { ProfilsHabilitationsCreateDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-create.dto';
import { ProfilsHabilitationsFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-filter.dto';
import { ProfilsHabilitationsUpdateDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-update.dto';
import { ProfilsHabilitationsCreateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-create.entity';
import { ProfilsHabilitationsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-filter.entity';
import { ProfilsHabilitationsUpdateEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-update.entity';
import { ProfilsHabilitationsEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations.entity';
import { ProfilsHabilitationsRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-repository';
import { ProfilsHabilitationsCreateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-create.vo';
import { ProfilsHabilitationsFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-filter.vo';
import { ProfilsHabilitationsUpdateVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-update.vo';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsUseCase {
    private readonly repository = inject(ProfilsHabilitationsRepository);

    readAll(
        filterDto: ProfilsHabilitationsFilterDto | null,
        page: string
    ): Observable<Paginate<ProfilsHabilitationsEntity>> {
        const vo = ProfilsHabilitationsFilterVo.fromDto(filterDto);
        const entity = ProfilsHabilitationsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(
        createDto: ProfilsHabilitationsCreateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilsHabilitationsCreateVo.fromDto(createDto);
        const entity = ProfilsHabilitationsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(
        updateDto: ProfilsHabilitationsUpdateDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = ProfilsHabilitationsUpdateVo.fromDto(updateDto);
        const entity = ProfilsHabilitationsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(id);
    }

    disable(id: string): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(id);
    }

    delete(code: string): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(code);
    }
}
