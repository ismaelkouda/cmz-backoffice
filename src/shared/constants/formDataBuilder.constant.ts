export const formDataBuilder = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((item) =>
        data[item] ? formData.append(item, data[item]) : formData
    );
    return formData;
};