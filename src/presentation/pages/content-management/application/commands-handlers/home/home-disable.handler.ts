import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeDisableCommand } from '@presentation/pages/content-management/application/commands/home/home-disable.command';
import { HomeUseCase } from '@presentation/pages/content-management/application/use-cases/home/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeDisableHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(command: HomeDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
