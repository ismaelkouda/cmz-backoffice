import { Injectable, inject } from '@angular/core';
import { infrastructureTypeDeleteCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure-type/infrastructure-type-delete.mapper';
import { InfrastructureTypeDeleteCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-delete.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeDeleteHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeDeleteCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.delete(
            infrastructureTypeDeleteCommandMapper(command)
        );
    }
}
