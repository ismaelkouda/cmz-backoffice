import { Injectable, inject } from '@angular/core';
import { infrastructureTypeEnableCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure-type/infrastructure-type-enable.mapper';
import { InfrastructureTypeEnableCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-enable.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeEnableHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeEnableCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.enable(
            infrastructureTypeEnableCommandMapper(command)
        );
    }
}
