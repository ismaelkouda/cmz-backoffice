import { inject, Injectable } from '@angular/core';
import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideDisableDto } from '@pages/content-management/application/dto/slide/slide-disable.dto';
import { SlideEnableDto } from '@pages/content-management/application/dto/slide/slide-enable.dto';
import { SlideFilterDto } from '@pages/content-management/application/dto/slide/slide-filter.dto';
import { SlideCreateContract } from '@pages/content-management/domain/contracts/slide/slide-create.contract';
import { SlideUpdateContract } from '@pages/content-management/domain/contracts/slide/slide-update.contract';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideRepository } from '@pages/content-management/domain/repositories/slide/slide-repository';
import { slideCreateVo } from '@pages/content-management/domain/value-objects/slide/slide-create.vo';
import { slideDeleteVo } from '@pages/content-management/domain/value-objects/slide/slide-delete.vo';
import { slideDisableVo } from '@pages/content-management/domain/value-objects/slide/slide-disable.vo';
import { slideEnableVo } from '@pages/content-management/domain/value-objects/slide/slide-enable.vo';
import { slideFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-filter.vo';
import { slideUpdateVo } from '@pages/content-management/domain/value-objects/slide/slide-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideUseCase {
    private readonly repository = inject(SlideRepository);

    execute(
        dto: SlideFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>> {
        return defer(() =>
            this.repository.readAll(slideFilterVo(dto), page, options)
        );
    }

    create(dto: SlideCreateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(slideCreateVo(dto)));
    }

    update(dto: SlideUpdateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(slideUpdateVo(dto)));
    }

    enable(dto: SlideEnableDto): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.enable(slideEnableVo(dto)));
    }

    disable(dto: SlideDisableDto): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.disable(slideDisableVo(dto)));
    }

    delete(dto: SlideDeleteDto): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.delete(slideDeleteVo(dto)));
    }
}
