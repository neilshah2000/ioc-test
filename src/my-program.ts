import { Inject } from './my-ioc'

export function myProgram() {
    class Program {
        @Inject('MyService')
        myClass!: any // or MyClass
    
        write(m: string): void {
            this.myClass.out(m)
        }
    }
    
    const p = new Program()
    p.write('** going via ioc container')
}

export function myProgram2() {
    class Program2 {
        @Inject('MyObject')
        myClass!: any // or MyClass
    
        write(m: string): void {
            this.myClass.out(m)
        }
    }
    
    const p = new Program2()
    p.write('** Object going via ioc container')
}


export function myProgram3() {
    class Program3 {
        @Inject('MyDependant')
        myClass!: any // or MyClass
    
        write(m: string): void {
            this.myClass.out(m)
        }
    }
    
    const p = new Program3()
    p.write('** Dependant going via ioc container')
}