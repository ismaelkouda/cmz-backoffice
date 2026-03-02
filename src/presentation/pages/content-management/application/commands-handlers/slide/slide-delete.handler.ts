import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { SlideDeleteCommand } from '@presentation/pages/content-management/application/commands/slide/slide-delete.command';
import { SlideUseCase } from '@presentation/pages/content-management/application/use-cases/slide/slide.use-case';

@Injectable({ providedIn: 'root' })
export class SlideDeleteHandler {
    constructor(private readonly useCase: SlideUseCase) {}

    execute(command: SlideDeleteCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.delete({
            uniqId: command.uniqId,
        });
    }
}
