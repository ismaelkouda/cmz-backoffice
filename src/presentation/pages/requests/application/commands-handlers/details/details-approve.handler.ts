import { detailsApproveCommandMapper } from '@pages/requests/application/commands-mappers/details/details-approve.mapper';
import { Injectable, inject } from '@angular/core';
import { DetailsApproveCommand } from '@pages/requests/application/commands/details/details-approve.command';
import { DetailsUseCase } from '@pages/requests/application/use-cases/details/details.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApproveHandler {
    private readonly useCase = inject(DetailsUseCase);

    execute(
        command: DetailsApproveCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.approve(detailsApproveCommandMapper(command));
    }
}
