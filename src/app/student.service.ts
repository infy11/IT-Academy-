import { Injectable } from '@angular/core';
import { Student } from './student';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { HttpHeaders } from "@angular/common/http";


const httpOptions ={
  headers: new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient) { }

  saveStudent(student:Student):Observable<Student>{
    return this.http.post<Student>("https://ovgihzj257.execute-api.us-east-1.amazonaws.com/Prod/save",student,httpOptions)
  }

  ViewStudent():Observable<Student>{
    return this.http.get<Student>("https://luzw4zio0f.execute-api.us-east-1.amazonaws.com/Prod/student?regNo=2332",httpOptions);
  }
}
