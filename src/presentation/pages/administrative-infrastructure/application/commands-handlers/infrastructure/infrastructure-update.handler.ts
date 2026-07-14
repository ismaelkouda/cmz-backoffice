import { Injectable, inject } from '@angular/core';
import { InfrastructureUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-update.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { infrastructureUpdateCommandMapper } from '@pages/administrative-infrastructure/application/commands-mappers/infrastructure/infrastructure-update.mapper';

@Injectable({ providedIn: 'root' })
export class InfrastructureUpdateHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureUpdateCommand
    ): Observable<MessageResponseDto> {
        return this.useCase.update(infrastructureUpdateCommandMapper(command));
    }
}
