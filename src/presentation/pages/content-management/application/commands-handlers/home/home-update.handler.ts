import { Injectable } from '@angular/core';
import { HomeUpdateCommand } from '@pages/content-management/application/commands/home/home-update.command';
import { HomeUseCase } from '@pages/content-management/application/use-cases/home/home.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
