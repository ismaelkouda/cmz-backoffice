import { Injectable } from '@angular/core';
import { SlideCreateCommand } from '@pages/content-management/application/commands/slide/slide-create.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideCreateHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create({
            timeDuration: command.timeDuration,
            type: command.type,
            image: command.image,
            video: command.video,
            platforms: command.platforms,
            startDate: command.startDate,
            endDate: command.endDate,
            title: command.title,
            subtitle: command.subtitle,
            content: command.content,
            buttonLabel: command.buttonLabel,
            buttonUrl: command.buttonUrl,
        });
    }
}
