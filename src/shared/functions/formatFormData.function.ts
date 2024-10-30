export function FormatFormData(data: { [key: string]: any }) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
            formData.append(key, value ?? '');
        }
    }
    return formData;
}