import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	constructor(public userService: UserService) {}

	selectedFile: any;
	userList: any[];
	imagePath = AppComponent.BACKEND_URL + '/files/logo/';

	ngOnInit() {}

	test() {
		let userData = {
			email: 'test8@test.com',
			name: 'Test user',
			phone: '666555444',
			signature: this.selectedFile
		};
		this.userService.registerClient(userData);
	}

	selectImage(event) {
		this.selectedFile = event.target.files[0];
	}

	getUsers() {
		this.userService.getUsers().subscribe((response: any) => {
			console.log(response);
			this.userList = response.users;
		});
	}

	uploadImage() {
		this.userService
			.upload(this.selectedFile)
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
