export const FormValidators = {
    CODE: {
        MIN: 2,
        MAX: 50,
        PATTERN: /^\S+$/,
    },
    NAME: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    DESCRIPTION: {
        MIN: 3,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    DECIMAL: {
        // Positive decimal number, up to 2 fraction digits (matches p-inputnumber mode="decimal" maxFractionDigits=2)
        PATTERN: /^\d+(\.\d{1,2})?$/,
    },
};
