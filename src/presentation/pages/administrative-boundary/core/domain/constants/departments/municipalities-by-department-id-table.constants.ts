export const MUNICIPALITIES_BY_DEPARTMENT_ID_TABLE_CONST = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.CODE',
            width: '6rem',
        },
        {
            field: 'name',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.NAME',
            width: '17rem',
        },
        {
            field: 'region',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.REGION',
            width: '12rem',
        },
        {
            field: 'populationSize',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.POPULATION_SIZE',
            class: 'text-center',
            width: '2rem',
        },
        /*  {
             field: 'description',
             header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.DESCRIPTION',
             width: '17rem',
         }, */
        {
            field: 'createdAt',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.CREATED_AT',
            class: 'text-center',
            width: '5rem',
        },
        /* {
            field: '__actionDropdown',
            header: 'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES_BY_DEPARTMENT_ID.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        }, */
    ],
    globalFilterFields: [
        'id',
        'code',
        'name',
        'region',
        'populationSize',
        'createdAt',
    ],
};
