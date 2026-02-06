import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { SlideRepository } from '../../domain/repositories/slide.repository';

@Injectable({
    providedIn: 'root',
})
export class DeleteSlideUseCase {
    constructor(private readonly slideRepository: SlideRepository) {}

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.slideRepository.deleteSlide(id);
    }
}
