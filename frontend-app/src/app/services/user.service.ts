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

	test_old() {
		return this.http.post(AppComponent.BACKEND_URL + "/register/client", {
			email: "test8@test.com",
			name: "Test user",
			phone: "666555444"
		});
	}

	test(userData: any) {
		console.log(userData);
		const signature_file = userData.signature;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (var key in userData) {
				formData.append(key, userData[key]);
			}
			formData.append("signature", signature_file, signature_file.name);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};
			const url = AppComponent.BACKEND_URL + "/register/client/";
			xhr.open("POST", url, true);
			xhr.setRequestHeader(
				"Authorization",
				localStorage.getItem("token")
			);
			xhr.send(formData);
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
	}

	updateUser(userData: any) {
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
			const url =
				AppComponent.BACKEND_URL + "/update/user/" + this.userID;
			xhr.open("PUT", url, true);
			xhr.send(formData);
		});
	}

	registerUser(userData: any) {
		console.log("register");
		const bg_file = userData.background_img;
		const logo_file = userData.logo_img;
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			const xhr = new XMLHttpRequest();
			for (var key in userData) {
				formData.append(key, userData[key]);
			}
			if (bg_file) {
				formData.append("background_image", bg_file, bg_file.name);
			}
			if (logo_file) {
				formData.append("logo_image", logo_file, logo_file.name);
			}
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(JSON.parse(xhr.response));
					}
				}
			};
			const url = AppComponent.BACKEND_URL + "/register/user/";
			xhr.open("POST", url, true);
			xhr.setRequestHeader(
				"Authorization",
				localStorage.getItem("token")
			);
			xhr.send(formData);
		});
	}

	getUserById() {
		let currentUser = localStorage.getItem("userID");
		// params = params.append('_id', currentUser);
		return this.http.get(`${AppComponent.BACKEND_URL}/user/${currentUser}`);
	}
}
