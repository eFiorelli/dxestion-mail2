import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) {}

	listen(evento: string, callback?: Function) {
		return this.socket.fromEvent(evento);
	}

	emit(evento: string, payload?: any, callback?: Function) {
		console.log('Emitiendo', evento);
		this.socket.emit(evento, payload, callback);
	}
}
