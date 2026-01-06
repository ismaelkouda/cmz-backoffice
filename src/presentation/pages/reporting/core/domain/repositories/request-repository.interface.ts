import { Observable } from 'rxjs';
import { RequestEntity } from '../entities/requests/request.entity';

export abstract class RequestRepository {
    abstract fetchRequests(): Observable<RequestEntity>;
}
