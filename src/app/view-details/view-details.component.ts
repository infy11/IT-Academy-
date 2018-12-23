import { Component, OnInit } from '@angular/core';
import {Course} from '../course';
import {Student} from '../student';
import {Education } from '../education';
import { StudentService} from '../student.service';



@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  student_details:Student;

  constructor(private studentService:StudentService) { 
    this.studentService.ViewStudent().subscribe(
      student=>{
        //this.student_details.photo="https://s3.amazonaws.com/it-academy-photos-bucket/varnit-photo.jpg";
        this.student_details=student;
        console.log(JSON.stringify(student));

        


      }
    );
  }

  ngOnInit() {
  }

}
