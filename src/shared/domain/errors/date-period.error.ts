export class InvalidDateRangeError extends Error {
    constructor(message?: string) {
        super(message || 'INVALID_DATE_RANGE');
        this.name = 'InvalidDateRangeError';
    }
}

export class InvalidStartDateError extends Error {
    constructor(message?: string) {
        super(message || 'INVALID_START_DATE');
        this.name = 'InvalidStartDateError';
    }
}

export class InvalidEndDateError extends Error {
    constructor(message?: string) {
        super(message || 'INVALID_END_DATE');
        this.name = 'InvalidEndDateError';
    }
}
