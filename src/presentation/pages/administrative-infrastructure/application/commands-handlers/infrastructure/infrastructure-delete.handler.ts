import { Injectable, inject } from '@angular/core';
import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureDeleteHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureDeleteCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
