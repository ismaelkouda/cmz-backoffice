import { Validators } from '@angular/forms';

export const RadioRelayLinksFormValidators = {
    NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 255,
    },
    OPERATOR: {
        PATTERN: '',
    },
    FREQUENCY: {
        PATTERN: '',
    },
};

export const RadioRelayLinksFormValidatorsService = {
    NAME: [
        Validators.required,
        Validators.minLength(RadioRelayLinksFormValidators.NAME.MIN_LENGTH),
        Validators.maxLength(RadioRelayLinksFormValidators.NAME.MAX_LENGTH),
    ],
    OPERATOR: [Validators.required],
    FREQUENCY: [Validators.required],
};

export const RadioRelayLinksFormValidatorsStream = {
    NAME: [Validators.required],
    OPERATOR: [Validators.required],
    FREQUENCY: [Validators.required],
};
