import { Injectable } from '@angular/core';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";
import {RegistrationNo} from './registration-no';


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient) { }

  saveStudent(student:Student):Observable<Student>{
    return this.http.post<Student>("https://ltwxzc10u7.execute-api.us-east-1.amazonaws.com/Prod/student",student,httpOptions)
  }

  ViewStudent():Observable<Student>{
    return this.http.get<Student>("https://ltwxzc10u7.execute-api.us-east-1.amazonaws.com/Prod/student?regNo=1040",httpOptions);
  }

  generateRegistrationNo():Observable<RegistrationNo>{
    return this.http.get<RegistrationNo>("https://ltwxzc10u7.execute-api.us-east-1.amazonaws.com/Prod/generate/",httpOptions);
  }

  
}
