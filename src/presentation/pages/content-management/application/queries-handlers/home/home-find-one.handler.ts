import { homeFindOneQueryMapper } from '@pages/content-management/application/queries-mappers/home/home-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { HomeFindOneQuery } from '@pages/content-management/application/queries/home/home-find-one.query';
import { HomeFindOneUseCase } from '@pages/content-management/application/use-cases/home/home-find-one.use-case';
import { HomeFindOneEntity } from '@pages/content-management/domain/entities/home/home-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeFindOneHandler {
    private readonly useCase = inject(HomeFindOneUseCase);

    execute(
        command: HomeFindOneQuery,
        options?: FetchOptions
    ): Observable<HomeFindOneEntity> {
        return this.useCase.execute(homeFindOneQueryMapper(command), options);
    }
}
