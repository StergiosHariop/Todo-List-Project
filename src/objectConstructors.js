/* Projects and Tasks Classes */

export class project{
    constructor(name){
        this.name = name;
        this.id = Date.now().toString();
        this.tasks = [];
    }
}

export class task{
    constructor(name,complete = false){
        this.name = name;
        this.id = Date.now().toString();
        this.complete = complete;
    }
}
