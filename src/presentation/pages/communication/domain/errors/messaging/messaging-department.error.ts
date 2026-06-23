import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class DepartmentRequiredError extends DomainError {
    readonly code = 'DEPARTMENT_REQUIRED';
    readonly messageKey =
        'COMMUNICATION.MESSAGING.FORM.ERROR.DEPARTMENT.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'department is required');
    }
}
