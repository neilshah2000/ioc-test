import { register } from './my-ioc'
import { myProgram } from './my-program'

class MyClass  {
    out(m: string): void {
        console.log(m)
    }
}

register(MyClass, 'MyClass')

myProgram()