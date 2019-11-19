import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { DialogComponent } from "../dialog/dialog.component";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  user: any = {
    email: "",
    password: "",
    name: ""
  };

  showSpinner: boolean = false;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {}

  showDialog(result, message?) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "400px",
      data: {
        action: "Register ",
        name: this.user.fullName,
        message: message,
        result: result
      }
    });
    this.showSpinner = false;
    this.user = {};
    this.router.navigate(["/login"]);
  }

  register() {
    this.showSpinner = true;
    this.userService.registerUser(this.user).subscribe(
      (res: any) => {
        this.showDialog(true, res.message);
      },
      err => {
        let message = err.error.err.message;
        this.showDialog(false, message);
      }
    );
  }
}
