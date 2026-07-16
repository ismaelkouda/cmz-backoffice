import { Injectable, inject } from '@angular/core';
import { infrastructureTypeDisableCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure-type/infrastructure-type-disable.mapper';
import { InfrastructureTypeDisableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-disable.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeDisableHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeDisableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.disable(
            infrastructureTypeDisableCommandMapper(command)
        );
    }
}
