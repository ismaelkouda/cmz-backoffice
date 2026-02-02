export const FormValidators = {
    CODE: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    NAME: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    DESCRIPTION: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{10,}$/,
    },
    FIRST_NAME: {
        MIN: 2,
        MAX: 50,
        PATTERN: /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
    },
    LAST_NAME: {
        MIN: 2,
        MAX: 50,
        PATTERN: /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
    },
    EMAIL: {
        MIN: 5,
        MAX: 100,
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PHONE: {
        MIN: 9,
        MAX: 14,
        PATTERN: /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/,
    },
};
