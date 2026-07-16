import { Injectable, inject } from '@angular/core';
import { infrastructureTypeUpdateCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure-type/infrastructure-type-update.mapper';
import { InfrastructureTypeUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-update.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeUpdateHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(
            infrastructureTypeUpdateCommandMapper(command)
        );
    }
}
