import { Injectable, inject } from '@angular/core';
import { siteGroupDisableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/site-group/site-group-disable.mapper';
import { SiteGroupDisableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-disable.command';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupDisableHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(command: SiteGroupDisableCommand): Observable<MessageResponseDto> {
        return this.useCase.disable(siteGroupDisableCommandMapper(command));
    }
}
