export const FormValidators = {
    NAME: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{3,}$/,
    },
    CODE: {
        MIN: 3,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{3,}$/,
    },
    DESCRIPTION: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{10,}$/,
    },
};
