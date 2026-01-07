import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { GetPrivacyPolicyByIdEntity } from '../entities/get-privacy-policy-by-id.entity';
import { PrivacyPolicyEntity } from '../entities/privacy-policy.entity';
import { PrivacyPolicyFilter } from '../value-objects/privacy-policy-filter.vo';

export abstract class PrivacyPolicyRepository {
    abstract fetchPrivacyPolicy(
        filter: PrivacyPolicyFilter,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>>;
    abstract getPrivacyPolicyById(
        id: string
    ): Observable<GetPrivacyPolicyByIdEntity>;
    abstract createPrivacyPolicy(
        params: FormData
    ): Observable<SimpleResponseDto<void>>;
    abstract updatePrivacyPolicy(
        id: string,
        params: FormData
    ): Observable<SimpleResponseDto<void>>;
    abstract deletePrivacyPolicy(
        id: string
    ): Observable<SimpleResponseDto<void>>;
    abstract publishPrivacyPolicy(
        id: string
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublishPrivacyPolicy(
        id: string
    ): Observable<SimpleResponseDto<void>>;
}
