import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

	user: any;
	public imagePath;
	background_imgURL: any;
	logo_imgURL: any;
	public message: string;

	preview(type: number, files: any) {
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
			if (type === 0) {
				this.logo_imgURL = reader.result;
			}
			if (type === 1) {
				this.background_imgURL = reader.result;
			}
		};
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
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

	selectBGImage(event) {
		this.user.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}

	removeImage(type: number) {
		if (type === 0) {
			this.logo_imgURL = null;
			this.user.logo_img = null;
		}

		if (type === 1) {
			this.background_imgURL = null;
			this.user.background_img = null;
		}
	}

}
