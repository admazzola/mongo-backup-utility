export default class SingletonLoopMethod {

    constructor(callback, args){
        this.callback = callback;
        this.args = args;
        this.execute = this.execute.bind(this)
    }
  
    start(delayMs = 1000 /* default to 1000 ms */){
        this.execute() // run callback instantly
        this.interval = setInterval( this.execute , delayMs )
    }
  
    stop(){
        clearInterval(this.interval)
    }
  
    async execute(){
        if(this.executing){
            console.error('ALREADY EXECUTING')
            return
        }
        this.executing=true
        await this.callback(...this.args)
        this.executing=false
    }
  
  }