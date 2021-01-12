const dependencies: any = {}

export function register(myClass: any, name: string): void {
    console.log('Registering ' + name)

    // instantiate straight away
    const myObj = new myClass
    dependencies[name] = myObj
}



// TypeScript decorator:
// Injects a dependency to a property.
// name = dependency
// value = class constructor or function prototype
// target = property name
export function Inject(name: string): Function {
    // Returns a function that is invoked for the property that is to be injected.
    return (value: any, target: string): void => {

        console.log('Setup to inject ' + name + ' to property ' + target + ' in ' + value.constructor.name)

        const resolved = dependencies[name]

        if(resolved) {
            value[target] = resolved
        } else {
            throw new Error('Dependency ' + name + ' is not registered')
        }
    };
}