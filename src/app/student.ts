import {Course} from './course';
import {Education} from './education';

export class Student {
  constructor(
    public regNo:String,
    public firstName:String,
    public lastName:String,
    public category:String,
    public gender:String,
    public fatherName:String,
    public motherName:String,
    public mobileNo:String,
    public dob:String,
    public address:String,
    public village:String,
    public city:String,
    public state:String,
    public photo:String,
    public course:Course,
    public education:Education[]
  ){}
}
