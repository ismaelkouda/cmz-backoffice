import { Observable } from 'rxjs';

import { ProfilsHabilitationsFindOneFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone-filter.entity';
import { ProfilsHabilitationsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone.entity';

export abstract class ProfilsHabilitationsFindOneRepository {
    abstract read(
        filter?: ProfilsHabilitationsFindOneFilterEntity
    ): Observable<ProfilsHabilitationsFindOneEntity>;
}
