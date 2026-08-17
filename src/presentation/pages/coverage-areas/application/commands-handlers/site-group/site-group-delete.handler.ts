import { Injectable, inject } from '@angular/core';
import { siteGroupDeleteCommandMapper } from '@pages/coverage-areas/application/commands-mappers/site-group/site-group-delete.mapper';
import { SiteGroupDeleteCommand } from '@pages/coverage-areas/application/commands/site-group/site-group-delete.command';
import { SiteGroupUseCase } from '@pages/coverage-areas/application/use-cases/site-group/site-group.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupDeleteHandler {
    private readonly useCase = inject(SiteGroupUseCase);

    execute(command: SiteGroupDeleteCommand): Observable<MessageResponseDto> {
        return this.useCase.delete(siteGroupDeleteCommandMapper(command));
    }
}
