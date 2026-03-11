import { inject, Injectable } from '@angular/core';
import { DepartmentsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-find-one-filter.dto';
import { DepartmentsFindOneQuery } from '@pages/administrative-boundary/application/queries/departments/departments-find-one.query';
import { DepartmentsFindOneBus } from '@pages/administrative-boundary/application/queries-bus/departments/departments-find-one.bus';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneFacade extends ObjectBaseFacade<
    DepartmentsFindOneEntity,
    DepartmentsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(DepartmentsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: DepartmentsFindOneFilterDto, force = false): void {
        const command = new DepartmentsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
