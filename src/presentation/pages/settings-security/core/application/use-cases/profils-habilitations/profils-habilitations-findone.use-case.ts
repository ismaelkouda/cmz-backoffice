import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfilsHabilitationsFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dtos/profils-habilitations/profils-habilitations-findone-filter.dto';
import { ProfilsHabilitationsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone-filter.entity';
import { ProfilsHabilitationsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone.entity';
import { ProfilsHabilitationsFindOneRepository } from '@presentation/pages/settings-security/core/domain/repositories/profils-habilitations/profils-habilitations-findone-repository';
import { ProfilsHabilitationsFindOneFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/profils-habilitations/profils-habilitations-findone-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class ProfilsHabilitationsFindOneUseCase {
    private readonly repository = inject(ProfilsHabilitationsFindOneRepository);

    read(
        filterDto: ProfilsHabilitationsFindOneFilterDto
    ): Observable<ProfilsHabilitationsFindOneEntity> {
        const vo = ProfilsHabilitationsFindOneFilterVo.fromDto(filterDto);
        const filter = ProfilsHabilitationsFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter);
    }
}
