import { PostDoctorModel, GetDoctorModel } from "../../models/index";
import {IDatabaseProvider } from "../../dataproviders/database-provider";
import {getqunoScoreNumber, paginateResult } from "../../helpers/helpers";

export class MockDataBaseProvider implements IDatabaseProvider{
    doctors : GetDoctorModel[]
    constructor(){
      this.doctors = []
    }
    createDoctor(doctor: PostDoctorModel){
      const lastIndex = this.doctors.length -1
      const lastId = this.doctors[lastIndex].doctor_id
      const newDoctor : GetDoctorModel = { doctor_id: lastId + 1, qunoScoreText: '', ...doctor }
      this.doctors.push(newDoctor)
      return new Promise<void>((resolve) => {
        resolve();
        });
    }

    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<[GetDoctorModel | GetDoctorModel[], number]>{
      if(id){
        const doctor = this.doctors.find(x => x.doctor_id == id) as GetDoctorModel;
        return new Promise((resolve) => {
          resolve([doctor,0]);
          });
      }
      else{
        if(orderBy === 1){
          this.doctors.sort( function( a , b){
            if(Number(a.doctor_id) > Number(b.doctor_id)) return 1;
            if(Number(a.doctor_id) < Number(b.doctor_id)) return -1;
            return 0;
        });
        }
        else{
          this.doctors.sort( function( a , b){
            if(Number(a.doctor_id) < Number(b.doctor_id)) return 1;
            if(Number(a.doctor_id) > Number(b.doctor_id)) return -1;
            return 0;
        });
        }
        // const doctors = this.doctors.slice((offset - 1) * limit, offset * limit)
        const doctors = paginateResult(this.doctors, offset, limit)
        return new Promise((resolve) => {
          resolve([getqunoScoreNumber(doctors), this.doctors.length]);
          });
      }
    }
  }