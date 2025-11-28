import { Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';
import { NewspapersEntity } from '../../domain/entities/management/newspapers/newspapers.entity';
import { NewspapersRepository } from '../../domain/repositories/newspapers.repository';
import { NewspapersFilter } from '../../domain/value-objects/newspapers-filter.vo';
import { NewspapersMapper } from '../mappers/newspapers.mapper';
import { NewspapersApi } from '../sources/newspapers.api';

@Injectable()
export class NewspapersRepositoryImpl extends NewspapersRepository {
    constructor(
        private readonly newspapersApi: NewspapersApi,
        private readonly newspapersMapper: NewspapersMapper
    ) {
        super();
    }

    fetchNewspapers(
        filter: NewspapersFilter,
        page: string
    ): Observable<Paginate<NewspapersEntity>> {
        console.log('azerty', filter);
        return this.newspapersApi
            .fetchNewspapers(filter.toDto(), page)
            .pipe(
                map((response) => this.newspapersMapper.mapFromDto(response))
            );
    }
}
