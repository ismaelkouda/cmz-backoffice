import { Observable } from 'rxjs';

import { NodeEntity } from '../entities/node/node.entity';

export abstract class NodeRepository {
    abstract getNode(): Observable<NodeEntity>;
}
