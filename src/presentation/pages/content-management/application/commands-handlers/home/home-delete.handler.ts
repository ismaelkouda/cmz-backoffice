import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeDeleteCommand } from '@presentation/pages/content-management/application/commands/home/home-delete.command';
import { HomeUseCase } from '@presentation/pages/content-management/application/use-cases/home/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeDeleteHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(command: HomeDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
