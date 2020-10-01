const MutexManager=require("../src/mutexmanager");
const m=new MutexManager();

describe("base tests",function(){
	it("lock first, then others can't get the lock",function(done){
		m.trylock("testlock");
		try{
			m.trylock("testlock");
			done(new Error());
		}catch(err){
			m.unlock("testlock");
			done();
		}

	});
	it("lock first, then unlock ,others can get the lock",function(done){
		m.trylock("testlock");
		m.unlock("testlock");
		try{
			m.trylock("testlock");
			m.unlock("testlock");
			done();
		}catch(err){
			done(err);
		}
	});
	it("create 1001 lock will get 'map is full' error",function(done){
		try{
			for(let i=0;i<1001;i++){
				m.trylock("testlock"+i);
				m.unlock("testlock"+i);
			}
			done(new Error());
		}catch(err){
			done();
		}
	});
	it("lock first,then unlock, and try waiting for lock",function(done){
		this.timeout(10000);
		m.trylock("testlock");

		setTimeout(()=>{
			m.unlock("testlock");
		},2500);

		m.lock("testlock").then(()=>{
			m.unlock("testlock");	
			done();
		});
	});
	it("lock first never unlock and try waiting for lock",function(done){
		this.timeout(20000);
		m.trylock("testlock");

		m.lock("testlock").then(()=>{
			m.unlock("testlock");	
			done();
		});
	});	
	
})
