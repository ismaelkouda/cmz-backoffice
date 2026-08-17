import { Injectable, inject } from '@angular/core';
import { siteGroupUpdateCommandMapper } from '@pages/coverage-areas/application/commands-mappers/site-group/site-group-update.mapper';
import { SiteGroupUpdateCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-update.command';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupUpdateHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(command: SiteGroupUpdateCommand): Observable<MessageResponseDto> {
        return this.useCase.update(siteGroupUpdateCommandMapper(command));
    }
}
