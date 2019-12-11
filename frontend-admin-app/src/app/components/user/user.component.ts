import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StoreService } from 'src/app/services/store.service';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: [ './user.component.css' ]
})
export class UserComponent implements OnInit {
	constructor(
		private userService: UserService,
		private storeService: StoreService,
		private activatedRoute: ActivatedRoute
	) {}

	user: any;
	public imagePath;
	background_imgURL: any;
	backendImgUrl = AppComponent.BACKEND_URL + '/files/user/';
	logo_imgURL: any;
	public message: string;
	showSpinner = false;
	noImage = 'assets/no-image.png';

	preview(files: any) {
		if (files.length === 0) {
			return;
		}

		const mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = 'Only images are supported.';
			return;
		}

		const reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.logo_imgURL = reader.result;
		};
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			const id = params.id;
			this.userService.getUserById(id).subscribe((user: any) => {
				if (user.ok) {
					this.user = user.user;
				} else {
					alert('Error');
				}
			});
		});
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}

	removeImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.user.logo_img = null;
		}
	}

	updateUser() {
		if (this.userService.updateUser(this.user)) {
			alert('Success');
		} else {
			alert('Error');
		}
	}

	cancel() {}
}
