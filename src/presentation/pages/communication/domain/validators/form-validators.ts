export const FormValidators = {
    REPORT_ID: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{3,}$/,
    },
    SUBJECT: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{10,}$/,
    },
    CONTENT: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*/=°§]{10,}$/,
    },
    MESSAGE: {
        MIN: 20,
        MAX: 2000,
        STRIP_HTML_MAX: 1000,
    },
};
