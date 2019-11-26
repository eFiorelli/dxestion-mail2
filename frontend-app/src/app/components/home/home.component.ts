import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
	constructor(public userService: UserService) {}

	selectedFile: File;

	ngOnInit() {}

	test() {
		this.userService.test().subscribe((response: any) => {
			alert(response.message);
		});
	}

	selectImage(event) {
		this.selectedFile = event.target.files[0];
		console.log(this.selectedFile);
	}

	uploadImage() {
		this.userService
			.upload(this.selectedFile)
			.subscribe((response: any) => {
				alert(response.message);
			});
	}
}
