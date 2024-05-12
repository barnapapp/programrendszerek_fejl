import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = new FormControl('', [Validators.email, Validators.required]);
  password = new FormControl('', [Validators.minLength(6), Validators.required]);
  error: string = "";

  constructor(private router: Router, 
              private authService: AuthService,
              private dataService: DataService) {}
  
  login() {
    if(!this.email.valid) {
      
      this.error = "Please enter email address format";
      setTimeout(() => {
        this.error = "";
      }, 3000);
      return;
    }

    if(!this.password.valid) {

      this.error = "Please enter valid password (min length 6)";
      setTimeout(() => {
        this.error = "";
      }, 3000);
      return;
    }

    if(this.email.value && this.password.value) {

      this.authService.login(this.email.value, this.password.value).subscribe({
        next: (data) => {

          let role: string;
          if(data) {

            this.authService.getUserRole().subscribe({
              next: (data: any) => {
                console.log(data);
                this.dataService.updateData(data.UserName);
                role = data.UserRole;
                if(role == "doctor") {

                  this.navigate("/user-management");
                } else {

                  this.navigate("/measured-value");
                }
              }, error: (err) => {
                console.log(err);
              }
            });
          }
        }, error: (err) => {
          console.log(err.error);
        },
      });
    } else {

      this.error = "The inputs are empty";
      setTimeout(() => {
        this.error = "";
      }, 3000);
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
