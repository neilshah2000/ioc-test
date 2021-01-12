import { register } from './my-ioc'
import { MyService } from './my-service'
import { MyFunction } from './my-function'
import { MyObject } from './my-object'
import { myProgram, myProgram2 } from './my-program'


register(MyService, 'MyService')

// register(MyFunction, 'MyFunction')

// transient object
register(MyObject, 'MyObject')

myProgram()

myProgram2()