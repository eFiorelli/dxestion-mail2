import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	test() {
		return this.http.post(AppComponent.BACKEND_URL + '/register/client', {
			email: 'test8@test.com',
			name: 'Test user',
			phone: '666555444'
		});
	}

	registerUser(userData: any) {
		return this.http.post(AppComponent.BACKEND_URL + '/register/user', {
			email: userData.email,
			password: userData.password,
			name: userData.name,
			username: userData.username,
			database_url: userData.database_url,
			database_name: userData.database_name,
			database_port: userData.database_port,
			database_username: userData.database_username,
			database_password: userData.database_password
		});
	}

	getUserById() {
		let currentUser = localStorage.getItem('userID');
		// params = params.append('_id', currentUser);
		return this.http.get(`${AppComponent.BACKEND_URL}/user/${currentUser}`);
	}

	updateUser(user: any) {
		let currentUser = localStorage.getItem('userID');
		// params = params.append('_id', currentUser);
		return this.http.put(`${AppComponent.BACKEND_URL}/user/${currentUser}`, { user });
	}
}
