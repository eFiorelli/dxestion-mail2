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
		// const id = localStorage.getItem('userID');
		const id = '5de3d8c35d3a692da2419d8e';
		this.userService.getUserById(id).subscribe((user: any) => {
			if (user.ok) {
				this.user = user.user;
			} else {
				alert('Error');
			}
		});
	}
}
