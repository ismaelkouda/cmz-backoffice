import { Injectable, inject } from '@angular/core';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { NodeRepository } from '@pages/monitoring/domain/repositories/node-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NodeUseCase {
    private readonly repository = inject(NodeRepository);

    execute(options?: FetchOptions): Observable<NodeEntity> {
        return this.repository.getNode(options);
    }
}
