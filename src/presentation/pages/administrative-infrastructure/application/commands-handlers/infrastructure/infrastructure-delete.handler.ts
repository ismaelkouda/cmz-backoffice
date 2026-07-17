import { Injectable, inject } from '@angular/core';
import { infrastructureDeleteCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure/infrastructure-delete.mapper';
import { InfrastructureDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-delete.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureDeleteHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureDeleteCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.delete(infrastructureDeleteCommandMapper(command));
    }
}
