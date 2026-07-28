export const OPTICAL_FIBER_NETWORK_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'name',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.NAME',
            width: '12rem',
        },
        {
            field: 'operator',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.OPERATOR',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'fiberConstructorName',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.CONSTRUCTOR',
            width: '10rem',
        },
        {
            field: 'typeLabel',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.TYPE',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: 'statusLabel',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'updatedAt',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'name',
        'operator',
        'fiberConstructorName',
        'typeLabel',
        'statusLabel',
        'updatedAt',
    ],
};
