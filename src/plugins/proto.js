const protobuf = require("protobufjs");
let root = null;

protobuf.load("proto/all_pb.proto", function(err, r) {
    if (err)
        throw err;
	root = r;
});

window.proto.encode = function (cmd, payload) {
	let Message = root.lookupType("pba.m_" + cmd + '_tos');	
	let message = Message.create(payload);
	let buffer = Message.encode(message).finish();	
	let msg = pack(cmd, buffer);
    return msg;
}

window.proto.decode = function (payload) {
	let reply = unpack(payload);
	if(reply.errorCode === 0){
		let Message = root.lookupType("pba.m_" + reply.cmd + '_toc');
		let data = Message.decode(reply.msg);
		return {
			cmd: reply.cmd,
			data: data
		}
	}
	else {
		return {
			cmd: reply.cmd,
			errorCode: reply.errorCode
		}
	}
	
}

function pack(cmd, data) {
	let dataSize = data.byteLength;	
	let buf = new ArrayBuffer(dataSize + 2);
	let packView = new DataView(buf);
	packView.setInt16(0, cmd);
	for (let i = 0; i < dataSize; i++) {
		packView.setInt8(i+2, data[i]);
	}
	return buf;
}

function unpack(bin) {
	let size = bin.byteLength;	
	let recvView = new DataView(bin);
	let errorCode = recvView.getInt16(0, false);	
	let cmd = recvView.getInt16(2, false);
	let messageArray = null;
	if (errorCode === 0){
		let messageBuffer = new ArrayBuffer(size - 4);
		let messageView = new DataView(messageBuffer);
		for (let i = 0; i < size-4; i++) {
			messageView.setInt8(i,recvView.getInt8(4+i));
		}
		messageArray = new Uint8Array(messageBuffer);
		return {
			cmd: cmd,
			errorCode: errorCode,
			msg: messageArray
		};
	}else{
		return {
			cmd: cmd,
			errorCode: errorCode
		};
	}

}