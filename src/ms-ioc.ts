import {Inject, Singleton} from "typescript-ioc";

// @Singleton
class PersonRestProxy  {
    out(m: string): void {
        console.log(m)
    }
}

class PersonDAO {
    @Inject
    restProxy!: PersonRestProxy;

    write(m: string): void {
        this.restProxy.out(m)
    }
}

let personDAO: PersonDAO = new PersonDAO();
personDAO.write('hello ioc cont')