import { Injectable, inject } from '@angular/core';
import { InfrastructureCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-create.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { Observable } from 'rxjs';
import { infrastructureCreateCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure/infrastructure-create.mapper';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class InfrastructureCreateHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(infrastructureCreateCommandMapper(command));
    }
}
