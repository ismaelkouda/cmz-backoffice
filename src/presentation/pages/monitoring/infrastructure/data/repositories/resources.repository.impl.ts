import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ResourcesEntity } from '../../../domain/entities/resources/resources.entity';
import { ResourcesRepository } from '../../../domain/repositories/resources-repository.interface';
import { ResourcesMapper } from '../mappers/resources.mapper';
import { ResourcesApi } from '../sources/resources.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class ResourcesRepositoryImpl implements ResourcesRepository {
    private readonly api = inject(ResourcesApi);
    private readonly requestMapper = inject(ResourcesMapper);

    fetchResources(options?: FetchOptions): Observable<ResourcesEntity> {
        return this.api
            .getResources(options)
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
