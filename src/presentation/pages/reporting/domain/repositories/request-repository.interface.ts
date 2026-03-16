import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { Observable } from 'rxjs';

export abstract class RequestRepository {
    abstract fetchRequests(): Observable<RequestsEntity>;
}
