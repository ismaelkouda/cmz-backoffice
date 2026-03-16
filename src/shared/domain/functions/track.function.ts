export function Track(
    moduleName: string,
    getDynamicData?: (instance: any) => any
): MethodDecorator {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]): void {
            const dynamicData = getDynamicData ? getDynamicData(this) : null;
            console.log(
                `Tracking setup for module: ${moduleName}, dynamic data:`,
                dynamicData
            );
            console.log(`Tracking method: ${String(propertyKey)}`, args);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
