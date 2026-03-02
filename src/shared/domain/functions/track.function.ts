export function Track(
    moduleName: string,
    actionName?: string
): MethodDecorator {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]): void {
            console.log(
                `Tracking setup for module: ${moduleName}, action: ${actionName || propertyKey.toString()}`
            );
            // Here you can add your tracking logic, e.g., sending data to an analytics service
            console.log(`Tracking method: ${String(propertyKey)}`, args);

            // Call the original method
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
