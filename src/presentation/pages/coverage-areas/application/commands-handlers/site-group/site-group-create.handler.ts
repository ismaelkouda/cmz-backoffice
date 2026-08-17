import { Injectable, inject } from '@angular/core';
import { siteGroupCreateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/site-group/site-group-create.mapper';
import { SiteGroupCreateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-create.command';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCreateHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(command: SiteGroupCreateCommand): Observable<MessageResponseDto> {
        return this.useCase.create(siteGroupCreateCommandMapper(command));
    }
}
