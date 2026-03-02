import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ResourcesEntity } from '../../../domain/entities/resources/resources.entity';
import { ResourcesRepository } from '../../../domain/repositories/resources-repository.interface';
import { ResourcesMapper } from '../mappers/resources.mapper';
import { ResourcesApi } from '../sources/resources.api';

@Injectable({ providedIn: 'root' })
export class ResourcesRepositoryImpl implements ResourcesRepository {
    constructor(
        private readonly api: ResourcesApi,
        private readonly requestMapper: ResourcesMapper
    ) {}

    fetchResources(): Observable<ResourcesEntity> {
        return this.api
            .getResources()
            .pipe(map((response) => this.requestMapper.mapFromDto(response)));
    }
}
