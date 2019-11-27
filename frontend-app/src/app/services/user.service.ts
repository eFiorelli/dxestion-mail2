import { Injectable } from "@angular/core";

import { Router } from "@angular/router";
import { AppComponent } from "../app.component";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class UserService {
	constructor(private http: HttpClient, private router: Router) {}

	userID = localStorage.getItem("userID");

	test() {
		return this.http.post(AppComponent.BACKEND_URL + "/register/client", {
			email: "test8@test.com",
			name: "Test user",
			phone: "666555444"
		});
	}

	upload(file) {
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			formData.append("image", file, file.name);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};
			const url =
				AppComponent.BACKEND_URL + "/upload/logo/" + this.userID;
			xhr.open("POST", url, true);
			xhr.send(formData);
		});
		//let url = AppComponent.BACKEND_URL + '/upload/background/5dda91afbd61a150e0313932';
		//return this.http.post(url, body, { headers });
	}

	registerUser(userData: any) {
		const bg_file = userData.background_img;
		const logo_file = userData.logo_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (var key in userData) {
				formData.append(key, userData[key]);
			}
			formData.append("background_image", bg_file, bg_file.name);
			formData.append("logo_image", logo_file, logo_file.name);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};
			const url = AppComponent.BACKEND_URL + "/register/user";
			xhr.open("POST", url, true);
			xhr.send(formData);
		});
		/*
		return this.http.post(AppComponent.BACKEND_URL + "/register/user", {
			email: userData.email,
			password: userData.password,
			name: userData.name,
			username: userData.username,
			database_url: userData.database_url,
			database_name: userData.database_name,
			database_port: userData.database_port,
			database_username: userData.database_username,
			database_password: userData.database_password,
			background_img: userData.background_img,
			logo_img: userData.logo_img
		});
		*/
	}

	getUserById() {
		let currentUser = localStorage.getItem("userID");
		// params = params.append('_id', currentUser);
		return this.http.get(`${AppComponent.BACKEND_URL}/user/${currentUser}`);
	}

	updateUser(user: any) {
		let currentUser = localStorage.getItem("userID");
		// params = params.append('_id', currentUser);
		return this.http.put(
			`${AppComponent.BACKEND_URL}/user/${currentUser}`,
			{ user }
		);
	}
}
