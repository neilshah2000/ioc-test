import { InjectProperty, InjectableClass, registerSingleton, InjectableSingleton, instantiateSingleton, setLogger, disableInjector, enableInjector, enableVerbose } from '.';

enableVerbose(true)

//
// Interface to the logging service.
interface IMessageService {
    info(msg: string): void;
}


// This is a lazily injected singleton that's constructed when it's injected.
@InjectableSingleton("IMessageService")
class MessageService implements IMessageService {
    info(msg: string): void {
        console.log(msg);
    }
}



@InjectableClass()
class MyClass {

    //
    // Injects the logging service into this property.
    //
    @InjectProperty("IMessageService")
    message!: IMessageService;

    myFunction() {
        //
        // Use the injected logging service.
        // By the time we get to this code path the logging service 
        // has been automatically constructed and injected.
        //
        this.message.info("Hello world!");
    }
    
}


// The logging singleton is lazily created at this point.
const myObject = new MyClass();

myObject.myFunction();



interface IMySingleton5 {
}

@InjectableSingleton("IMySingleton5")
class MySingleton5 implements IMySingleton5 {
    @InjectProperty("MySingleton7")
    dep1!: MySingleton7;
}

interface IMySingleton6 {
}

@InjectableSingleton("IMySingleton6")
class MySingleton6 implements IMySingleton6 {
    @InjectProperty("IMySingleton5")
    dep1!: IMySingleton5;
}

interface IMySingleton7 {
}

@InjectableSingleton("IMySingleton7")
class MySingleton7 implements IMySingleton7 {
    @InjectProperty("IMySingleton6")
    dep1!: IMySingleton6;
}

@InjectableClass()
class MyClass2 {
    @InjectProperty("IMySingleton7")
    dep!: IMySingleton7;
}

new MyClass2()