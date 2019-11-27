import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {
	user: any = {
		username: 'qqq',
		password: 'qqq',
		name: 'qqq',
		email: 'qqq@qqq.com',
		database_url: '192.168.0.2',
		database_name: 'BD1',
		database_port: '1443',
		database_username: 'sa',
		database_password: 'masterkey',
		background_img: '',
		logo_img: ''
	};

	showSpinner: boolean = false;

	constructor(private userService: UserService, public dialog: MatDialog, private router: Router) {}

	ngOnInit() {}

	showDialog(result, message?) {
		const dialogRef = this.dialog.open(DialogComponent, {
			width: '400px',
			data: {
				action: 'Register ',
				name: this.user.fullName,
				message: message,
				result: result
			}
		});
		this.showSpinner = false;
		// this.user = {};
		// this.router.navigate(["/login"]);
	}

	register() {
		this.showSpinner = true;
		// this.userService.registerUser(this.user).subscribe(
		// 	(res: any) => {
		// 		this.showDialog(true, res.message);
		// 	},
		// 	err => {
		// 		let message = err.error.err.message;
		// 		this.showDialog(false, message);
		// 	}
		// );
		console.log(this.user.background_img);
		if (this.userService.registerUser(this.user)) {
			this.showDialog(true, 'Success');
		} else {
			this.showDialog(false, 'Error');
		}
	}

	selectBGImage(event) {
		this.user.background_img = event.target.files[0];
	}

	selectLogoImage(event) {
		this.user.logo_img = event.target.files[0];
	}
}
