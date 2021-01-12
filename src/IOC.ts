
//
// Constructors that can be called to instantiate singletons.
//
const injectableConstructors = new Map<string, Function>();

//
// Collection of all singletons objects that can be injected.
//
const instantiatedObjects = new Map<string, any>();


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


//
// TypeScript decorator:
// Marks a class as injectable.
// Not require for singletons, they are automatically injectable.
//
export function Autowired(): Function {
    // Returns a factory function that creates a proxy constructor.
    return makeConstructorInjectable;
}


////////////////////// helpers //////////////



//
// Takes a constructor and makes it 'injectable'.
// Wraps the constructor in a proxy that handles injecting dependencies.
//
function makeConstructorInjectable(origConstructor: Function): Function {
    console.log('** Making constructor injectable: ' + origConstructor.name)

    if (!origConstructor.prototype.__injections__) {
        // Record properties to be injected against the constructor prototype.
        origConstructor.prototype.__injections__ = []; 
    }

    const proxyHandler = {
        construct(target: any, args: any[], newTarget: any) {
            console.log('++++ Proxy constructor for injectable class: ' + origConstructor.name)
        
            // 
            // Construct the object ...
            //
            const obj = Reflect.construct(target, args, newTarget);

            try {
                //
                // ... and then resolve property dependencies.
                //
                resolvePropertyDependencies(origConstructor.name, obj, origConstructor.prototype.__injections__);
            }
            catch (err) {
                console.error(`Failed to construct ${origConstructor.name} due to exception thrown by ${resolvePropertyDependencies.name}.`);
                throw err;
            }

            return obj;
        }
    };

    // Wrap the original constructor in a proxy.
    // Use the proxy to inject dependencies.
    // Returns the proxy constructor to use in place of the original constructor.
    return new Proxy(origConstructor, proxyHandler);
}



//
// Instantiates a singleton.
// If it's already instantiated then the original is returned instead.
//
export function instantiateSingleton<T = any>(dependencyId: string): T {
    console.log("<<< Requesting singleton: " + dependencyId)

    try {
        const existingSingleton = instantiatedObjects.get(dependencyId);
        if (existingSingleton) {
            console.log("= Singleton already exists: " + dependencyId);

            // The singleton has previously been instantiated.
            return existingSingleton;
        }
    
        const singletonConstructor = injectableConstructors.get(dependencyId);
        if (!singletonConstructor) {
            // The requested constructor was not found. 
            const msg = "No constructor found for singleton  " + dependencyId;
            console.error(msg);
            console.log("Available constructors: \r\n" +
                Array.from(injectableConstructors.entries())
                    .map(entry => 
                        "\t" + entry[0] + " -> " + entry[1].name
                    )
                    .join("\r\n")
            );
            throw new Error(msg);
        }
    
        console.log("= Lazily instantiating singleton: " + dependencyId);
        
        // Construct the singleton.
        const instantiatedSingleton = Reflect.construct(makeConstructorInjectable(singletonConstructor), []);

        // Cache the instantiated singleton for later reuse.
        instantiatedObjects.set(dependencyId, instantiatedSingleton);

        console.log("= Lazily instantiated singleton: " + dependencyId);

        return instantiatedSingleton;
    }
    catch (err) {
        console.error("Failed to instantiate singleton " + dependencyId);
        console.error(err && err.stack || err);
        throw err;
    }
}

//
// Resolve dependencies for properties of an instantiated object.
//
function resolvePropertyDependencies(constructorName: string, obj: any, injections: any[]): void {

    if (injections) {
        // if (enableCircularCheck) {
        //     if (injectionMap.has(constructorName)) {
        //         throw new Error(`${constructorName} has already been injected, this exception breaks a circular reference that would crash the app.`);
        //     }

        //     injectionMap.add(constructorName);
        // }

        try {

            for (const injection of injections) {
                const dependencyId = injection[1];
                
                console.log(">>>> Injecting " + dependencyId);
    
                const singleton = instantiateSingleton(dependencyId);
                if (!singleton) {
                    throw new Error("Failed to instantiate singleton " + dependencyId);
                }
    
                obj[injection[0]] = singleton;
            }
        }
        finally {
            // if (enableCircularCheck) {
            //     injectionMap.delete(constructorName);
            // }
        }
    }
}