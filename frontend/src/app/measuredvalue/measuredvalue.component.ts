import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/model/User';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-measuredvalue',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './measuredvalue.component.html',
  styleUrl: './measuredvalue.component.scss'
})
export class MeasuredvalueComponent {
  measuredValueForm!: FormGroup;
  doctors!: User[];
  private dataSubscription?: Subscription;
  userName: string = "";


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private dataService: DataService,
              private authService: AuthService,
              private router: Router) {}

  data$ = this.dataService.data$;
  ngOnInit() {

    this.dataSubscription = this.data$.subscribe({
      next: (name) => {

        this.userName = name;
      }
    });

    this.measuredValueForm = this.formBuilder.group({
      bloodPressure: [null, [Validators.min(0), Validators.pattern('^[0-9]^$')]],
      pulse: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(30), Validators.max(200)]],
      bloodSugar: [null, [Validators.min(70), Validators.max(140)]],
      age: [null, [Validators.min(0), Validators.max(120)]],
      doctor: ['Dr.Papp Barna'],
      from: this.userName
    });

    this.userService.getAllDoctors().subscribe({
      next: (data) => {
        
        this.doctors = data;
        console.log(this.doctors);
      }, error: (err) => {

        console.log(err);
      }
    });
  }

  onSubmit() {

    if(!this.measuredValueForm.valid) {

      console.log("Please specify valid data");
      return;
    }

    this.userService.addMeaseruedValue(this.measuredValueForm.value).subscribe({
      next: (data) => {

        console.log(data);
      }, error: (err) => {

        console.log(err);
      } 
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }
  
}
