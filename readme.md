## Jigsaw-Mutex 文档

### 1.1 简介
  
这是使用Jigsaw封装的分布式互斥锁,可以在jigsaw网络上创建一个提供互斥锁的服务  
    
### 1.2 动机
    
   线上的分布式业务部分接口是不允许并发执行的，例如对账户的复杂修改需要较长时间的读写数据库，    
   如果这时候再次发生一次同样的操作，很可能发生对数据库的脏读，导致操作的错误执行，这时候就需要让这个事务是同步的，    
   任意时刻只能有一个事务在执行发生。    
    
   使用互斥锁，可以抽象出一个被管理了的资源，各种服务需要争夺该资源的使用权，一旦获取，其他服务就得等待该资源被释放。     
   这样任意时刻都该资源只会有一个服务在使用，保证了事务的同步性。     
    
### 1.3 安装
  
在npm项目下执行命令    
```npm install ZhyMc/jigsaw-mutex --save```    
  
### 1.4 测试
   
clone 本项目后,在项目文件夹执行 mocha 即可进行测试    
   
### 1.5 用例
  
#### 1.5.1 简单用例
    
mutex.js      
```
const {jigsaw} = require("jigsaw.js")("127.0.0.1","127.0.0.1");
const Mutex = require("jigsaw-mutex");

let jg=new jigsaw("mutex");

new Mutex(jg);
```
  
a.js  

```
const {jigsaw} = require("jigsaw.js")("127.0.0.1","127.0.0.1");

let jg=new jigsaw("gamecenter");

jg.port("match",async({player})=>{
	await jg.send("mutex:trylock",{key:`match-${player}`});

	/*
		trylock:如果上锁失败,那么之后不会执行,
		lock:等待一段时间，直到获取到锁为止
	 */
	
	//some codes about matching a game

	await jg.send("mutex:unlock",{key:`match-${player}`});
});
```
  
b.js   
```
const {jigsaw} = require("jigsaw.js")("127.0.0.1","127.0.0.1");

let jg=new jigsaw();

jg.on("ready",async()=>{
	try{
		await jg.send("gamecenter:match");
		console.log("匹配完毕!")		
	}catch(err){
		console.log("匹配失败,你已经在执行一个匹配任务.");
	}
})
```
