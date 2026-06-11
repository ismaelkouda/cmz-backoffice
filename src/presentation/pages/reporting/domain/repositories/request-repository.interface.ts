import { RequestsEntity } from '@pages/reporting/domain/entities/requests/requests.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class RequestRepository {
    abstract fetchRequests(options?: FetchOptions): Observable<RequestsEntity>;
}
