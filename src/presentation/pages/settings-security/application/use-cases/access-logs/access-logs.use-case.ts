import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { AccessLogsFilterDto } from '@presentation/pages/settings-security/application/dto/access-logs/access-logs-filter.dtos';
import { AccessLogsFilterEntity } from '@presentation/pages/settings-security/domain/entities/access-logs/access-logs-filter.entity';
import { AccessLogsEntity } from '@presentation/pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { AccessLogsRepository } from '@presentation/pages/settings-security/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsFilterVo } from '@presentation/pages/settings-security/domain/value-objects/access-logs/access-logs-filter.vo';

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
