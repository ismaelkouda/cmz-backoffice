import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { HomeUpdateCommand } from '@presentation/pages/content-management/application/commands/home/home-update.command';
import { HomeUseCase } from '@presentation/pages/content-management/application/use-cases/home/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeUpdateHandler {
    constructor(private readonly useCase: HomeUseCase) {}

    execute(command: HomeUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
            image: command.image,
            platforms: command.platforms,
            startDate: command.startDate,
            endDate: command.endDate,
            title: command.title,
            resume: command.resume,
            content: command.content,
            buttonLabel: command.buttonLabel,
            buttonUrl: command.buttonUrl,
        });
    }
}
