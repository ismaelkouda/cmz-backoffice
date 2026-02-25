import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { NodeEntity } from '../../../domain/entities/node/node.entity';
import { NodeRepository } from '../../../domain/repositories/node-repository.interface';
import { NodeMapper } from '../mappers/node.mapper';
import { NodeApi } from '../sources/node.api';

@Injectable({ providedIn: 'root' })
export class NodeRepositoryImpl implements NodeRepository {
    private readonly api = inject(NodeApi);
    private readonly nodeMapper = inject(NodeMapper);

    getNode(): Observable<NodeEntity> {
        return this.api
            .getNode()
            .pipe(map((response) => this.nodeMapper.mapFromDto(response)));
    }
}
