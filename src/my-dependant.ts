import { Inject } from './my-ioc'

export class MyDependant  {
    @Inject('MyService')
    myService!: any
    
    print(m: string): void {
        this.myService.out(m)
    }
}