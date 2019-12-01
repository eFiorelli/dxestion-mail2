import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	user: {};
	constructor(private userService: UserService) {}

	ngOnInit() {
		const id = localStorage.getItem('userID');
		this.userService.getUserById(id).subscribe((user: any) => {
			if (user.ok) {
				this.user = user.user;
			} else {
				alert('Error');
			}
		});
	}
}
