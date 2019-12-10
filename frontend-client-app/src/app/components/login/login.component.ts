import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
	constructor(private auth: AuthService, private router: Router) {}

	username: string = "igavd24chk";
	password: string = "1234";
	credentials: Object;
	showSpinner: boolean;

	ngOnInit() {
		localStorage.clear();
	}

	login(): void {
		this.showSpinner = true;
		this.credentials = { username: this.username, password: this.password };
		this.auth.login(this.credentials).subscribe(
			res => {
				if (res) {
					this.showSpinner = false;
					this.router.navigate(["/home"]);
				}
			},
			error => {
				Swal.fire("Login incorrecto", error, "error");
				this.showSpinner = false;
			}
		);
	}
}
