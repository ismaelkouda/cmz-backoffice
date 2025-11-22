import { Observable } from 'rxjs';
import { ManagementEntity } from '../entities/management/management.entity';
import { ManagementForm } from '../value-objects/management-form.vo';

export abstract class ManagementRepository {
    abstract fetchTake(
        formValue: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity>;

    abstract fetchApprove(
        formValue: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity>;

    abstract fetchReject(
        formValue: ManagementForm,
        endPointType: EndPointType
    ): Observable<ManagementEntity>;

    abstract fetchProcess(
        formValue: ManagementForm
    ): Observable<ManagementEntity>;
}
