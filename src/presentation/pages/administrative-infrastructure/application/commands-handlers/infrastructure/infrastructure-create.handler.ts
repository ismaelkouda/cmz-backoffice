import { Injectable, inject } from '@angular/core';
import { InfrastructureCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure/infrastructure-create.command';
import { InfrastructureUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure/infrastructure.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureCreateHandler {
    private readonly useCase = inject(InfrastructureUseCase);

    execute(
        command: InfrastructureCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
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
