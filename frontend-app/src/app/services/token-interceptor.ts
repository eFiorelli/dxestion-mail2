import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor(public auth: AuthService) {
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers: any;
        if (localStorage.getItem('token')) {
            // Attach headers to request
            headers = new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
        } else {
            headers = new HttpHeaders({                
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
        }
        const cloneReq = request.clone({headers});

        return next.handle(cloneReq);
    }
}