import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoints } from '../endpoints';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    const body = {
      username: email,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(endpoints.login, body, {headers: headers, withCredentials: true});
  }

  logout() {
    return this.http.post(endpoints.logout, {}, {withCredentials: true});
  }

  checkAuth() {
    return this.http.get<boolean>(endpoints.checkAuth, { withCredentials: true });
  }
}
