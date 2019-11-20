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
		email: '',
		password: '',
		name: ''
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
		this.user = {};
		this.router.navigate([ '/login' ]);
	}

	register() {
		this.user.username = this.user.name;
		this.user.database_url = 'http:192.168.0.2';
		this.user.database_name = 'TEST';
		this.user.database_port = '1443';
		this.user.database_username = 'sa';
		this.user.database_password = 'masterkey';
		console.log(this.user);
		this.showSpinner = true;
		this.userService.registerUser(this.user).subscribe(
			(res: any) => {
				this.showDialog(true, res.message);
			},
			(err) => {
				let message = err.error.err.message;
				this.showDialog(false, message);
			}
		);
	}
}
