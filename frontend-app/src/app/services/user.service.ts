import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    constructor(private http: HttpClient, private router: Router) { }

    registerUser(userData: any){
        return this.http.post( AppComponent.BACKEND_URL + '/register', { 
            email: userData.email,
            password: userData.password,
            name: userData.name});
    }

    getUserById(){
        let currentUser = localStorage.getItem('userID');
        // params = params.append('_id', currentUser);
        return this.http.get(`${AppComponent.BACKEND_URL}/user/${currentUser}`);
    }

    updateUser(user: any){
        let currentUser = localStorage.getItem('userID');
        // params = params.append('_id', currentUser);
        return this.http.put(`${AppComponent.BACKEND_URL}/user/${currentUser}`, {user});
    }
}
