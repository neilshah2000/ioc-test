const dependencies: any = {}

export function register(Dependency: any, name: string): void {
    console.log('Registering ' + name)
    console.log('type ' + typeof Dependency)
    switch(typeof Dependency) {
        case 'function': // class
            // instantiate straight away
            const myInst = new Dependency()
            dependencies[name] = myInst
            break;
        case 'object':
            // already created
            const myObj = Dependency
            dependencies[name] = myObj
            break;
    }
    
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