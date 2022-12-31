import { databaseConfig } from "./config/db";
import { DoctorModel } from "./models/doctor";

const PgConnection = require('postgresql-easy');

export interface IDatabaseProvider {
    createDoctor(data: DoctorModel): Promise<void>;
    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<DoctorModel | DoctorModel[]>;
  }
  
  export class PostgreSQLProvider implements IDatabaseProvider{
    async createDoctor(data: DoctorModel){
      const db = new PgConnection(databaseConfig);
      await db.insert('doctors', data)
    }

    async getDoctors(limit: number, offset: number, orderBy: number, id?: number) : Promise<DoctorModel | DoctorModel[]>{
      const db = new PgConnection(databaseConfig);
      if(id){
        const result = await db.getById('doctors', id)[0] as DoctorModel;
        return result
      }
      else{
        const orderByQuery = orderBy == 1 ? 'ASC' : 'DESC'
        const sql = `select * from doctors ORDER BY dateCreated ${orderByQuery}`
        const allDoctors = await db.query(sql) as DoctorModel[];
        // Paginate Result
        const doctors = allDoctors.slice((offset - 1) * limit, offset * limit)
        return doctors
      }
    }
  }

  export class MockDataBaseProvider implements IDatabaseProvider{
    doctors : DoctorModel[]
    constructor(){
      this.doctors = []
    }
    createDoctor(doctor: DoctorModel){
      this.doctors.push(doctor)
      return new Promise<void>((resolve) => {
        resolve();
        });
    }

    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<DoctorModel | DoctorModel[]>{
      if(id){
        const doctor = this.doctors.find(x => x.id == id) as DoctorModel;
        return new Promise((resolve) => {
          resolve(doctor);
          });
      }
      else{
        if(orderBy === 1){
          this.doctors.sort( function( a , b){
            if(a.id > b.id) return 1;
            if(a.id < b.id) return -1;
            return 0;
        });
        }
        else{
          this.doctors.sort( function( a , b){
            if(a.id < b.id) return 1;
            if(a.id > b.id) return -1;
            return 0;
        });
        }
        const doctors = this.doctors.slice((offset - 1) * limit, offset * limit)
        return new Promise((resolve) => {
          resolve(doctors);
          });
      }
    }
  }

