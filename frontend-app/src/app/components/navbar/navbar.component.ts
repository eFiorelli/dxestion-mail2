import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    
    constructor(public auth: AuthService, private router: Router) {
    }
    
    ngOnInit() {
    }

    registerUser(){
        this.router.navigate(['/register']);
    }

    userProfile(){
        this.router.navigate(['/profile']);
    }

    login(){
        this.router.navigate(['/login']);
    }
    
    logout(){
        this.auth.logout();
    }
    
}
