import { Injectable, inject } from '@angular/core';
import { NodeHandler } from '@pages/monitoring/application/queries-handlers/node/node.handler';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NodeBus {
    private readonly filterHandler = inject(NodeHandler);

    dispatch(): Observable<NodeEntity> {
        return this.filterHandler.execute();
    }
}
