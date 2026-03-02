import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SlideFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one-filter.entity';
import { SlideFindOneEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class SlideFindOneRepository {
    abstract execute(
        filter: SlideFindOneFilterEntity
    ): Observable<SlideFindOneEntity>;
}
