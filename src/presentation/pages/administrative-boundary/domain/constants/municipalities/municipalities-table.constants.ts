export const MUNICIPALITIES_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.CODE',
            width: '5rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'department',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.DEPARTMENT',
            width: '10rem',
        },
        {
            field: 'region',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.REGION',
            width: '12rem',
        },
        {
            field: 'populationSize',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.POPULATION_SIZE',
            class: 'text-center',
            width: '7rem',
            type: 'number',
        },
        {
            field: 'infrastructureCount',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.INFRASTRUCTURES_COUNT',
            class: 'text-center',
            width: '7rem',
            type: 'number',
        },
        /*  {
             field: 'description',
             header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.DESCRIPTION',
             width: '17rem',
         }, */
        {
            field: 'createdAt',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.CREATED_AT',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'id',
        'name',
        'code',
        'region',
        'department',
        'populationSize',
        'infrastructureCount',
        'createdAt',
    ],
};
