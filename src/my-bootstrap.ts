import { register } from './my-ioc'
import { MyService } from './my-service'
import { MyFunction } from './my-function'
import { MyObject } from './my-object'
import { MyDependant } from './my-dependant'
import { myProgram, myProgram2, myProgram3 } from './my-program'


register(MyService, 'MyService')

// register(MyFunction, 'MyFunction')

// transient object
register(MyObject, 'MyObject')

// register(MyDependant, 'MyDependant')

myProgram()

myProgram2()

// myProgram3()