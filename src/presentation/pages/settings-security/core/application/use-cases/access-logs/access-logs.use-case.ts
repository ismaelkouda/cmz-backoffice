import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { AccessLogsFilterDto } from '@presentation/pages/settings-security/core/application/dtos/access-logs/access-logs-filter.dtos';
import { AccessLogsFilterEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity';
import { AccessLogsRepository } from '@presentation/pages/settings-security/core/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsFilterVo } from '@presentation/pages/settings-security/core/domain/value-objects/access-logs/access-logs-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class AccessLogsUseCase {
    private readonly repository = inject(AccessLogsRepository);

    execute(
        filterDto: AccessLogsFilterDto | null,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        const vo = AccessLogsFilterVo.fromDto(filterDto);
        const entity = AccessLogsFilterEntity.fromVo(vo);
        if (entity?.appliesToAdminScope()) {
            // règles spécifiques
        }
        return this.repository.readAll(entity, page);
    }
}
