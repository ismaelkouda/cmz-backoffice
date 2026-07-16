import { slideCreateCommandMapper } from '@pages/content-management/application/commands-mappers/slide/slide-create.mapper';
import { Injectable, inject } from '@angular/core';
import { SlideCreateCommand } from '@pages/content-management/application/commands/slide/slide-create.command';
import { SlideUseCase } from '@pages/content-management/application/use-cases/slide/slide.use-case';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideCreateHandler {
    private readonly useCase = inject(SlideUseCase);

    execute(command: SlideCreateCommand): Observable<SimpleResponseDto<void>> {
        return this.useCase.create(slideCreateCommandMapper(command));
    }
}
