import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';

@Component({
	selector: 'app-log',
	templateUrl: './log.component.html',
	styleUrls: [ './log.component.css' ]
})
export class LogComponent implements OnInit {
	logMessages: any[];

	constructor(private socketService: SocketService) {}

	ngOnInit() {
		let messageArray = [];
		this.socketService.emit('log message', { text: 'hey' });
		this.socketService.listen('log message').subscribe((message: string) => {
			console.log(message);
			if (message) {
				const date = message.split(' ')[0].split('[')[1];
				const hour = message.split(' ')[1].split(']')[0];
				const type = message.split(' - ')[1].split(': ')[0];
				const text = message.split(': ')[1];
				const splitMessage = { date, hour, type, text };
				messageArray.push(splitMessage);
			}
		});
		this.logMessages = messageArray;
	}
}
