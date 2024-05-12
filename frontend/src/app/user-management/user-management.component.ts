import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { User } from '../shared/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { SickData } from '../shared/model/SickData';
import { DataService } from '../shared/services/data.service';
import { filter, forkJoin, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users?: User[];
  sickData!: SickData[];
  doctorName!: string;
  private dataSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService
  ) { }

  data$ = this.dataService.data$;
  ngOnInit() {

    this.dataSubscription = this.data$.pipe(
      switchMap((name) => {
        this.doctorName = name;
        return forkJoin({
          sickData: this.userService.getSickData(),
          allPatients: this.userService.getAllPatient()
        });
      })
    ).subscribe({
      next: ({ sickData, allPatients }) => {
        this.sickData = sickData.filter(value => value.doctor === this.doctorName);
        this.users = allPatients.filter(patient => this.sickData.some(sick => sick.from === patient.name));
      },
      error: (err) => {
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
