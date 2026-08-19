export const MOBILE_NETWORK_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'siteId',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.SITE_ID',
            width: '3rem',
        },
        {
            field: 'siteName',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.SITE_NAME',
            width: '10rem',
        },
        {
            field: 'towerTypeName',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.TOWER_TYPE',
            width: '8rem',
        },
        {
            field: 'towerHeight',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.TOWER_SIZE',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'networkTechnology',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.TECHNOLOGY',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'operator',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.SITE_GROUPE',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'statusLabel',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.STATUS',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'updatedAt',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: '__actionDropdown',
            header: 'COVERAGE_AREAS.MOBILE_NETWORK.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'siteId',
        'siteName',
        'towerTypeName',
        'towerHeight',
        'networkTechnology',
        'operator',
        'statusLabel',
        'updatedAt',
    ],
};
