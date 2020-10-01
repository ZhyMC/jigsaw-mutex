
const util=require("util");
const sleep=util.promisify(setTimeout);
const assert=require("assert");

class Mutex{
	constructor(key){
		assert(key,"lock key must be specified");
		this.key=key;
		this.locked=false;
		
		this.lock_timeout=null;

	}
	_startTimeout(){//如果上了锁,10秒后还没解锁则会自动解锁,防止死锁
		this.lock_timeout=setTimeout(()=>{
			try{
				this.unlock();
			}catch(err){

			}
		},10000);
	}
	_endTimeout(){
		clearTimeout(this.lock_timeout);
	}
	trylock(){//乐观锁的方法
		if(this.locked)
			throw new Error("get lock failed, at this moment, some others are holding this lock");

		this.locked=true;
		this._startTimeout();
	}
	async lock(timeout){//悲观锁的方法
		if(!timeout)
			timeout=15000;
		assert(
			typeof(timeout) === "number"&&
			 timeout>0 && timeout<60000,
			"timeout must be specified correctly");

		let dura=50;
		let times=Math.floor(timeout/dura);

		for(let i=0;i<times;i++){
			try{
				this.trylock();
				return;
			}catch(err){

			}

			await sleep(dura);
		}
		throw new Error("get the lock failed");
	}
	unlock(){
		if(!this.locked)
			throw new Error("this lock hasn't been locked");

		this.locked=false;
		this._endTimeout();
	}

}


module.exports=Mutex;
