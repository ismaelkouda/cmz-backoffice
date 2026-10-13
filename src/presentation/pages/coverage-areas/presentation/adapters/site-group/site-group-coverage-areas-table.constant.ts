export const SITE_GROUP_COVERAGE_AREAS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'site_id',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.SITE_ID',
            width: '8rem',
        },
        {
            field: 'site_name',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.SITE_NAME',
            width: '12rem',
        },
        {
            field: 'tower_height',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.TOWER_SIZE',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'network_technology',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.TECHNOLOGY',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'operator',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.OPERATOR',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'updated_at',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__selection',
            header: 'COMMON.SELECT',
            class: 'text-center',
            width: '2rem',
        },
    ],
    globalFilterFields: [
        'site_id',
        'site_name',
        'tower_height',
        'network_technology',
        'operator',
        'updated_at',
    ],
};
