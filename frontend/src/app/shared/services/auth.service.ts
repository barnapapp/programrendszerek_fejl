import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // login
  login(email: string, password: string) {

    const body = {
      "username": email,
      "password": password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post('http://localhost:3000/app/login', body, {headers: headers, withCredentials: true});
  }

  register(user: User) {

    const body = {
      "email": user.email,
      "name": user.name,
      "birthDate": user.birthDate,
      "birthLocation": user.birthLocation,
      "mobileNumber": user.mobileNumber,
      "password": user.password,
      "role": "patient"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('http://localhost:3000/app/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:3000/app/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:3000/app/checkAuth', { withCredentials: true });
  }

  getUserRole() {

    return this.http.get<string>('http://localhost:3000/app/checkRole', { withCredentials: true });
  }
}
