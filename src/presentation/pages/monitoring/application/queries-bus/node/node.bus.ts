import { Injectable } from '@angular/core';
import { NodeHandler } from '@pages/monitoring/application/queries-handlers/node/node.handler';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NodeBus {
    constructor(private readonly filterHandler: NodeHandler) {}

    dispatch(): Observable<NodeEntity> {
        return this.filterHandler.execute();
    }
}
