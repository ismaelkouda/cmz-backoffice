import { Injectable, inject } from '@angular/core';
import { infrastructureTypeCreateCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure-type/infrastructure-type-create.mapper';
import { InfrastructureTypeCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-create.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeCreateHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeCreateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.create(
            infrastructureTypeCreateCommandMapper(command)
        );
    }
}
