import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AppComponent } from '../../app.component';
import { FilterUsersPipe } from '../../pipes/filter-users.pipe';
import { Router } from '@angular/router';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: [ './users.component.css' ],
	providers: [ FilterUsersPipe ]
})
export class UsersComponent implements OnInit {
	constructor(public userService: UserService, public filterUsersPipe: FilterUsersPipe, private router: Router) {}

	users: any[];
	userList: any[];
	imagePath = AppComponent.BACKEND_URL + '/files/user/';
	noImage = './assets/no-image.jpg';
	searchText = '';
	usersListFiltered: any[];

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.userService.getUsers().subscribe((response: any) => {
			this.users = response.users;
			this.userList = response.users;
		});
	}

	searchUsers(text?: string) {
		/* Search filter */
		if (text !== '' && text !== undefined && text !== null) {
			this.userList = this.users;
			this.searchText = text;
			this.usersListFiltered = this.filterUsersPipe.transform(this.userList, this.searchText);
			this.userList = this.usersListFiltered;
		} else {
			this.searchText = '';
			this.userList = this.users;
		}
		if (!this.usersListFiltered) {
			return;
		}
	}

	userDetail(id: string) {
		this.router.navigate([ '/user/', id ]);
	}

	userStores(user: any) {
		// localStorage.setItem('selectedUserID', user._id);
		this.router.navigate([ '/stores/', user._id ]);
	}
}
