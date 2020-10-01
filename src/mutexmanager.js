const LimitMap=require("./limitmap");
const Mutex=require("./mutex");

class MutexManager{
	constructor(){
		this.locks=new LimitMap(1000);
	}
	_getLock(key){
		let lock=this.locks.get(key);
		if(!this.locks.has(key)){
			lock=new Mutex(key);
			this.locks.set(key,lock);
		}

		return lock;
	}
	trylock(key){
		let lock=this._getLock(key);
		return lock.trylock();
	}
	lock(key){
		let lock=this._getLock(key);
		return lock.lock();
	}
	unlock(key){
		let lock=this._getLock(key);
		return lock.unlock();
	}
}

module.exports=MutexManager;
