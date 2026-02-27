import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeEnableCommand } from '@presentation/pages/content-management/application/commands/home/home-enable.command';
import { HomeUseCase } from '@presentation/pages/content-management/application/use-cases/home/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeEnableHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(command: HomeEnableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.enable({
            uniqId: command.uniqId,
        });
    }
}
