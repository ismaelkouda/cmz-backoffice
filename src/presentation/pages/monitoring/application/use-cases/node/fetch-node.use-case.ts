import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NodeEntity } from '../../../domain/entities/node/node.entity';
import { NodeRepository } from '../../../domain/repositories/node-repository.interface';

@Injectable({
    providedIn: 'root',
})
export class FetchNodeUseCase {
    private readonly repository = inject(NodeRepository);

    execute(): Observable<NodeEntity> {
        return this.repository.getNode();
    }
}
