import { Observable } from 'rxjs';

import { NodeEntity } from '../entities/node/node.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

export abstract class NodeRepository {
    abstract getNode(options?: FetchOptions): Observable<NodeEntity>;
}
