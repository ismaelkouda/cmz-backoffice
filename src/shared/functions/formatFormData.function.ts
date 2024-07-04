export function FormatFormData(data: { [key: string]: any }) {
    const dataToSend = new FormData;
    for (const [key, value] of Object.entries(data)) {
        dataToSend.append(key, value)
    }
    return dataToSend; 
} 