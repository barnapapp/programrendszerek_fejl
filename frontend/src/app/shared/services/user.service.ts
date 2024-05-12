import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { SickData } from '../model/SickData';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAllPatient() {
    return this.http.get<User[]>('http://localhost:3000/app/getAllUsers?role=patient', {withCredentials: true});
  }

  getAllDoctors() {
    return this.http.get<User[]>('http://localhost:3000/app/getAllUsers?role=doctor', { withCredentials: true });
  }

  addMeaseruedValue(measuredValue: SickData) {

    const body = {
      "bloodPressure": measuredValue.bloodPressure,
      "pulse": measuredValue.pulse,
      "weight": measuredValue.weight,
      "bloodSugar": measuredValue.bloodSugar,
      "age": measuredValue.age,
      "doctor": measuredValue.doctor,
      "from": measuredValue.from
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<SickData>('http://localhost:3000/app/addmeasuredvalue', body, { withCredentials: true, headers: headers });
  }


  getSickData() {

    return this.http.get<SickData[]>('http://localhost:3000/app/getsickdata', { withCredentials: true });
  }
}
