import { Injectable, inject } from '@angular/core';
import { NodeUseCase } from '@pages/monitoring/application/use-cases/node/node.use-case';
import { NodeEntity } from '@pages/monitoring/domain/entities/node/node.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NodeHandler {
    private readonly useCase = inject(NodeUseCase);

    execute(options?: FetchOptions): Observable<NodeEntity> {
        return this.useCase.execute(options);
    }
}
