import { inject, Injectable } from "@angular/core";
import { AccessLogsFilterDto } from "@presentation/pages/settings-security/core/application/dtos/access-logs-filter.dtos";
import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { AccessLogsFilterVo } from "@presentation/pages/settings-security/core/domain/value-objects/access-logs-filter.vo";
import { AccessLogsRepositoryImpl } from "@presentation/pages/settings-security/infrastructure/data/repositories/access-logs/access-logs-repository.impl";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AccessLogsUseCase {
    private readonly repository = inject(AccessLogsRepositoryImpl);

    readAll(
        filterDto: AccessLogsFilterDto | null,
        page: string
    ): Observable<Paginate<AccessLogsEntity>> {
        const filter = AccessLogsFilterVo.create(filterDto);
        return this.repository.readAll(filter, page);
    }
}