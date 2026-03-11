import { Injectable } from '@angular/core';
import { SlideUpdateCommand } from '@pages/content-management/application/commands/slide/slide-update.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideUpdateHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideUpdateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.update({
            uniqId: command.uniqId,
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
