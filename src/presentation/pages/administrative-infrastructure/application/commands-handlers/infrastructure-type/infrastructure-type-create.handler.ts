import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeCreateCommand } from '@presentation/pages/administrative-infrastructure/application/commands/infrastructure-type/infrastructure-type-create.command';
import { InfrastructureTypeUseCase } from '@pages/administrative-infrastructure/application/use-cases/infrastructure-type/infrastructure-type.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeCreateHandler {
    private readonly useCase = inject(InfrastructureTypeUseCase);

    execute(
        command: InfrastructureTypeCreateCommand
    ): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            name: command.name as string,
            description: command.description as string,
        });
    }
}
