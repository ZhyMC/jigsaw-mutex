const assert=require("assert");
const MutexManager=require("./mutexmanager");

class JGMutex{
	constructor(jg){
		assert(jg,"jigsaw must be specified");
		this.jg=jg;
		this.mutexmanager=new MutexManager();

		this.export();
	}
	export(){
		this.jg.port("lock",({key})=>this.mutexmanager.lock(key));
		this.jg.port("trylock",({key})=>this.mutexmanager.trylock(key));
		this.jg.port("unlock",({key})=>this.mutexmanager.unlock(key));
	}
}


module.exports=JGMutex;
