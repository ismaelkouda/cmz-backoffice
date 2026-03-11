import { Injectable } from '@angular/core';
import { HomeDisableCommand } from '@pages/content-management/application/commands/home/home-disable.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeDisableHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(command: HomeDisableCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.disable({
            uniqId: command.uniqId,
        });
    }
}
