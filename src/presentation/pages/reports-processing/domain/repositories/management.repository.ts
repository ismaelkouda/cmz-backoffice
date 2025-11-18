import { Observable } from 'rxjs';
import { ManagementEntity } from '../entities/management/management.entity';
import { ManagementForm } from '../value-objects/management-form.vo';

export abstract class ManagementRepository {
    abstract fetchTake(formValue: ManagementForm): Observable<ManagementEntity>;

    abstract fetchApprove(
        formValue: ManagementForm
    ): Observable<ManagementEntity>;

    abstract fetchReject(
        formValue: ManagementForm
    ): Observable<ManagementEntity>;

    abstract fetchProcess(
        formValue: ManagementForm
    ): Observable<ManagementEntity>;
}
