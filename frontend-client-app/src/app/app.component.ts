import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent {
	title = 'frontend-app';
	static BACKEND_URL = 'http://backend.nuclient.es:85';
	static SOCKET_URL = 'http://backend.nuclient.es:85';
	// static BACKEND_URL = 'http://localhost:3000';
	// static SOCKET_URL = 'http://localhost:3000';
}
