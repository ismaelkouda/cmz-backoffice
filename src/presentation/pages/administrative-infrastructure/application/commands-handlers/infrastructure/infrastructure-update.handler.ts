import { Injectable, inject } from '@angular/core';
import { InfrastructureUpdateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-update.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureUpdateHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureUpdateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            name: command.name as string,
            type: command.type as string,
            description: command.description as string,
            region: command.region as string,
            department: command.department as string,
            municipality: command.municipality as string,
            position: command.position as string,
        });
    }
}
