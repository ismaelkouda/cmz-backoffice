import { Observable } from 'rxjs';
import { DetailsEntity } from '../entities/details/details.entity';

export abstract class DetailsRepository {
    abstract fetchDetails(
        id: string,
        endPointType: EndPointType
    ): Observable<DetailsEntity>;
}
