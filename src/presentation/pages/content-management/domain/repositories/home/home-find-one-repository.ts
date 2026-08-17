import { Injectable } from '@angular/core';
import { HomeFindOneFilterEntity } from '@pages/content-management/domain/entities/home/home-find-one-filter.entity';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class HomeFindOneRepository {
    abstract execute(
        filter: HomeFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<HomeFindOneEntity>;
}
