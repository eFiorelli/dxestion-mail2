import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private http: HttpClient, private router: Router) {}

	storeInfo;

	login(credentials) {
		return this.http.post(AppComponent.BACKEND_URL + '/login/store', { credentials }).pipe(
			map((res: any) => {
				this.storeInfo = res;
				console.log(this.storeInfo);
				localStorage.setItem('token', this.storeInfo.token);
				localStorage.setItem('bg_image', this.storeInfo.store.background_img);
				localStorage.setItem('gpdr_text', this.storeInfo.store.gpdr_text);
				localStorage.setItem('ff', JSON.stringify(this.storeInfo.store.free_fields));
				return true;
			})
		);
	}

	logout() {
		localStorage.clear();
		this.router.navigate([ '/login' ]);
	}

	getToken() {
		return localStorage.getItem('token') || null;
	}

	isAuthenticated(): boolean {
		const token = localStorage.getItem('token');

		if (token) {
			return true;
		} else {
			return false;
		}
	}

	isAdmin(): boolean {
		return localStorage.getItem('role') === 'ADMIN_ROLE';
	}
}
