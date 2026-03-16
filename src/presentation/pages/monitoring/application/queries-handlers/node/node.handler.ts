import { Injectable } from '@angular/core';
import { NodeUseCase } from '@pages/monitoring/application/use-cases/node/node.use-case';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NodeHandler {
    constructor(private readonly useCase: NodeUseCase) {}

    execute(): Observable<NodeEntity> {
        return this.useCase.execute();
    }
}
