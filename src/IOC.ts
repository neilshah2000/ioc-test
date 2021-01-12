
//
// Constructors that can be called to instantiate singletons.
//
const injectableConstructors = new Map<string, Function>();


//
// TypeScript decorator:
// Marks a class as an automatically created singleton that's available for injection.
// Makes a singleton available for injection.
//
export function Injectable(dependencyId: string): Function {
    console.log('** Registering singleton ' + dependencyId)

    // Returns a factory function that records the constructor of the class so that
    // it can be lazily created later as as a singleton when required as a dependency.
    return (target: Function): void => {
        console.log('** Caching constructor for singleton ' + dependencyId)
        // Adds the target constructor to the set of lazily createable singletons.
        injectableConstructors.set(dependencyId, target);
    }
}

//
// TypeScript decorator:
// Injects a dependency to a property.
//
export function InjectProperty(dependencyId: string): Function {
    // Returns a function that is invoked for the property that is to be injected.
    return (prototype: any, propertyName: string): void => {

        console.log('** Setup to inject ' + dependencyId + ' to property ' + propertyName + ' in ' + prototype.constructor.name)

        if (!prototype.__injections__) {
            // Record properties to be injected against the constructor prototype.
            prototype.__injections__ = []; 
        }

        // Record injections to be resolved later when an instance is created.
        prototype.__injections__.push([propertyName, dependencyId]);
    };
}