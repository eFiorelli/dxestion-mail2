import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
	user: any;
	constructor(private userService: UserService, private router: Router) {}

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

	changePassword() {
		this.userService.changeAdminPassword(this.user._id, '1234').subscribe((response: any) => {
			if (response.ok) {
				Swal.fire('Exito', 'Contraseña actualizada', 'success').then(() => {
					this.router.navigate([ '/home' ]);
				});
			} else {
				Swal.fire('Fallo', 'No fue posible actualizar la contraseña', 'error');
			}
		});
	}
}
