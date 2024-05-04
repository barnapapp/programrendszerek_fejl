import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = new FormControl('', [Validators.email, Validators.required]);
  password = new FormControl('', [Validators.minLength(2), Validators.required]);

  constructor(private router: Router, private authService: AuthService) {}
  
  login() {
    if(!this.email.valid) {
      console.log("kerem adjon meg valid emailt");
      return;
    }

    if(!this.password.valid) {
      console.log("kerem adjon meg valid passwordot");
      return;
    }

    if(this.email.value && this.password.value) {

      this.authService.login(this.email.value, this.password.value).subscribe({
        next: (data) => {
          if(data) {
            console.log(data);
            this.navigate("/user-management");
          }
        }, error: (err) => {
          console.log(err.error);
        },
      });
    } else {
      console.log("empty input fiam");
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
