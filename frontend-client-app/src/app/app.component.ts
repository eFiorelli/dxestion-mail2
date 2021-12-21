import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent {
	title = 'frontend-app';
	static BACKEND_URL = 'https://backend.nuclient.es';
	static SOCKET_URL = 'https://backend.nuclient.es';
	// static BACKEND_URL = 'http://localhost:3000';
	// static SOCKET_URL = 'http://localhost:3000';
}
