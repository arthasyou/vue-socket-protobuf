import WebSocket from 'html5-websocket'
import ReconnectingWebSocket from 'reconnecting-websocket'
import config from '../config/global'

import store from '../store';


const options = { constructor: WebSocket };	


// const socket = new WebSocket('ws://' + config.socket.ip + ':' + config.socket.port);
		
const socket = new ReconnectingWebSocket('ws://' + config.socket.ip + ':' + config.socket.port, undefined, options);
socket.timeout = 1000;

socket.addEventListener('open', ()=> {
	console.log("连接成功");
	// let user = store.getters.user;
	// if(user) {
	// 	net.send({cmd:1006,data:{player_id: user.player_id}})
	// }
});

socket.addEventListener('close', ()=> {
	console.log("连接断开");
});

socket.onerror = (err) => {
	if (err.code == 'EHOSTDOWN') {
		console.log('Error: server down.')
	}
};

socket.addEventListener('message', (e)=> {
	let reader = new FileReader();
	reader.readAsArrayBuffer(e.data);
	
    reader.onload = function () {
		let msg = window.proto.decode(reader.result);
		console.log(msg);
		store.commit('setProto', msg)
    };
});

window.net.send = function(cmd, data) {
	socket.send(window.proto.encode(cmd, data));
}