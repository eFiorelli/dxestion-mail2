import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	constructor(public userService: UserService) {}

	selectedFile: any;

	ngOnInit() {}

	test() {
		this.userService.test().subscribe((response: any) => {
			alert(response.message);
		});
	}

	selectImage(event) {
		this.selectedFile = event.target.files[0];
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
