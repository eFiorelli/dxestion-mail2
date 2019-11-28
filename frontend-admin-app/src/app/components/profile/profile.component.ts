import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    user = {
        name: '',
        password: '',
        email: '',
        role: ''
    };

    showSpinner: boolean = false;

    constructor(private userService: UserService, public dialog: MatDialog) {
        this.userService.getUserById().subscribe((response: any) => {
            if (response.ok) {
                this.user = response.user;
            }
        })
    }

    ngOnInit() {
    }

    showDialog(result, message?) {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: { action: 'Update ', name: this.user.name, message: message, result: result }
        });
        this.showSpinner = false;
    }

    update() {
        /*
        this.userService.updateUser(this.user).subscribe (
            (response:any) =>{
                if (response.ok){
                    this.showDialog(true, response.message)
                } else {
                    this.showDialog(false, response.err.message)    
                }
            },
            error =>{
                this.showDialog(false, error.message)
            });
            */
    }

    cancel() {
        this.userService.getUserById().subscribe((response: any) => {
            if (response.ok) {
                this.user = response.user;
            }
        })
    }

}
