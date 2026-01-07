export const FormValidators = {
    TITLE: {
        MIN: 3,
        MAX: 100,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{3,}$/,
    },
    SUBTITLE: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{10,}$/,
    },
    RESUME: {
        MIN: 10,
        MAX: 250,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{10,}$/,
    },
    CONTENT: {
        MIN: 20,
        MAX: 2000,
        STRIP_HTML_MAX: 1000,
    },
    BUTTON_LABEL: {
        MIN: 1,
        MAX: 30,
        PATTERN: /^[a-zA-Z0-9À-ÿ\s\-!?.,;:'"()&%$€£@#+*\/=°§]{1,}$/,
    },
    TIME_DURATION_IN_SECONDS: {
        MIN: 1,
        MAX: 10,
        STEP: 1,
    },
    BUTTON_URL: {
        MAX: 500,
        PATTERN: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    },
    VIDEO_URL: {
        MAX: 500,
        PATTERNS: {
            YOUTUBE: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            VIMEO: /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/,
            DAILYMOTION: /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+$/,
            GENERIC: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/,
        },
    },

    IMAGE_FILE: {
        MAX_SIZE_MB: 2,
        ALLOWED_TYPES: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
        ],
        MAX_DIMENSIONS: {
            WIDTH: 1920,
            HEIGHT: 1080,
        },
    },
};
