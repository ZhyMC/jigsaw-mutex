class LimitMap{//被限制了长度的键值表
	constructor(size){
		this.map=new Map();
		this.keylist=[];
		this.size=size || 1000
	}
	set(key,value){
		if(!this.map.has(key)){
			if(this.keylist.length>this.size)
				throw new Error("map is full");

			this.keylist.push(key);
		}
		
		this.map.set(key,value);
	}
	get(key){
		return this.map.get(key);
	}
	has(key){
		return this.map.has(key);
	}
}

module.exports=LimitMap;