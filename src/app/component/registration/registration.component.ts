import { Component, OnInit } from '@angular/core';
import {Course} from '../../course';
import {Student} from '../../student';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  state:String[]=['UTTRAKHAND','UTTRAPRADESH'];
  gender:String[]=['MALE','FEMALE'];
  category:String[]=['UR','OBC','SC','ST'];
  course:Course=new Course('','','','','');
  student:Student=new Student('','','','','','','','','','','','',this.course);
  submitted:false;

  constructor() { }

  ngOnInit() {
  }

}
