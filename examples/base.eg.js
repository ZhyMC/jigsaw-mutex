const {jigsaw,domainserver} = require("jigsaw.js")("127.0.0.1","127.0.0.1");
domainserver();

const Mutex = require("../");
let jg=new jigsaw("mutex");
new Mutex(jg);


let gamecenter=new jigsaw("gamecenter");

gamecenter.port("match",async({player})=>{
	await jg.send("mutex:trylock",{key:`match-${player}`});

	console.log("start match");

	await jg.send("mutex:unlock",{key:`match-${player}`});
});

gamecenter.on("ready",async()=>{
	gamecenter.send("gamecenter:match",{player:"1"});
	gamecenter.send("gamecenter:match",{player:"1"});

	setTimeout(()=>{
		gamecenter.send("gamecenter:match",{player:"1"});
	},1000);
})