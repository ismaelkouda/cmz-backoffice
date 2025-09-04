export const formDataBuilder = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((item) =>
        data[item] ? formData.append(item, data[item]) : formData
    );
    return formData;
};

export const formDataBuilderSome = (data: any) => {
    const formData = new FormData();
    const appendToFormData = (key: string, value: any) => {
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                Object.keys(item).forEach((subKey) => {
                    formData.append(
                        `${key}[${index}][${subKey}]`,
                        item[subKey]
                    );
                });
            });
        } else {
            formData.append(key, value);
        }
    };
    Object.keys(data).forEach((item) => {
        if (data[item] !== undefined && data[item] !== null) {
            appendToFormData(item, data[item]);
        }
    });
    return formData;
};
