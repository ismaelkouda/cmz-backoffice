import { Injectable, inject } from '@angular/core';
import { siteGroupEnableCommandMapper } from '@pages/coverage-areas/application/commands-mappers/site-group/site-group-enable.mapper';
import { SiteGroupEnableCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-enable.command';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupEnableHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(command: SiteGroupEnableCommand): Observable<MessageResponseDto> {
        return this.useCase.enable(siteGroupEnableCommandMapper(command));
    }
}
