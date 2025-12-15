import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { SlideRepository } from '../../domain/repositories/slide.repository';

@Injectable({
    providedIn: 'root',
})
export class DisableSlideUseCase {
    constructor(private readonly slideRepository: SlideRepository) { }

    execute(id: string): Observable<SimpleResponseDto<void>> {
        return this.slideRepository.disableSlide(id);
    }
}
