import { InjectProperty, Injectable, Autowired } from './IOC';



interface IMySingleton6 {
    message(msg: string): void;
}

@Injectable("IMySingleton6")
class MySingleton6 implements IMySingleton6 {
    message(msg: string): void {
        console.log(msg);
    }
}

interface IMySingleton7 {
    out(msg: string): void;
}

@Injectable("IMySingleton7")
class MySingleton7 implements IMySingleton7 {
    @InjectProperty("IMySingleton6")
    dep1!: IMySingleton6;

    out(m: string): void {
        this.dep1.message(m)
    }
}

@Autowired()
export class MyClass2 {
    @InjectProperty("IMySingleton7")
    dep!: IMySingleton7;

    write(m: string): void {
        this.dep.out(m)
    }
}

new MyClass2().write('Hello from class2')
