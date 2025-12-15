export const PRIVACY_POLICY_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'version',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.VERSION',
            width: '6rem',
        },
        {
            field: 'status',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.STATUS',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'createdAt',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.CREATED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'publishedAt',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.PUBLISHED_AT',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: '__action',
            header: 'CONTENT_MANAGEMENT.PRIVACY_POLICY.TABLE.ACTION',
            class: 'text-center',
            width: '6rem',
        }
    ],
    globalFilterFields: [
        'uniqId',
        'name',
        'version',
        'status',
        'createdAt',
        'publishedAt',
    ],
};
