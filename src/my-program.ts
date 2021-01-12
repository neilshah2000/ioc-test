import { Inject } from './my-ioc'

export function myProgram() {
    class Program {
        @Inject('MyClass')
        myClass!: any // or MyClass
    
        write(m: string): void {
            this.myClass.out(m)
        }
    }
    
    const p = new Program()
    p.write('going via ioc container')
}