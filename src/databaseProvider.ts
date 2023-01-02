import { databaseConfig, testDatabaseConfig } from "./config/db";
import { PostDoctorModel, GetDoctorModel, QuonoScoreMappingModel, DatabaseConfiguration } from "./models";

const PgConnection = require('postgresql-easy');

const getqunoScoreNumber = (doctors : GetDoctorModel[]) : GetDoctorModel[] => {
  // get quonoScore Mapping from Environment Variable
  const qunoScoreMapping = JSON.parse(process.env.QUNO_SCORE_MAPPING as string)  as QuonoScoreMappingModel
  doctors.forEach(doctor => {
    // Discard decimal part of Quno Score number with bitwise NOT operator.
    const qunoScoreNumber = ~~doctor.quno_score_number
    /*If qunoScoreNumber is less than 6 then set value to 0, if qunoScore is 10 then set value to 9 because 10 has the same
    rating as 9*/
    const qunoScore = qunoScoreNumber < 6 ? 0 : qunoScoreNumber === 10 ? 9 : qunoScoreNumber
    doctor.qunoScoreText = qunoScoreMapping[qunoScore]
  });
  return doctors
}

const paginateResult = (doctors : GetDoctorModel[], offset: number, limit: number) : GetDoctorModel[] => {
  return doctors.slice((offset - 1) * limit, offset * limit)
}

export interface IDatabaseProvider {
    createDoctor(data: PostDoctorModel): Promise<void>;
    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<[GetDoctorModel | GetDoctorModel[], number]>;
  }
  
  export class PostgreSQLDatabaseProvider implements IDatabaseProvider{
    private databaseConfiguration : DatabaseConfiguration
    constructor() { 
      const env = process.env.QUNOENV as string
      this.databaseConfiguration = env.trim().toLowerCase() === 'test' ? testDatabaseConfig : databaseConfig
   }
    async createDoctor(data: PostDoctorModel){
      const db = new PgConnection(this.databaseConfiguration);
      await db.insert('doctors', data)
    }

    async getDoctors(limit: number, offset: number, orderBy: number, id?: number) : Promise<[GetDoctorModel | GetDoctorModel[], number]>{
      const db = new PgConnection(this.databaseConfiguration);
      if(id){
        const result = await db.getById('doctors', id)[0] as GetDoctorModel;
        return [result,0]
      }
      else{
        const orderByQuery = orderBy == 1 ? 'ASC' : 'DESC'
        const sql = `select * from doctors ORDER BY dateCreated ${orderByQuery}`
        const allDoctors = await db.query(sql) as GetDoctorModel[];
        // Paginate Result
        const doctors = paginateResult(allDoctors, offset, limit)

        return [getqunoScoreNumber(doctors), allDoctors.length]
      }
    }
  }

  export class MockDataBaseProvider implements IDatabaseProvider{
    doctors : GetDoctorModel[]
    constructor(){
      this.doctors = []
    }
    createDoctor(doctor: PostDoctorModel){
      const lastIndex = this.doctors.length -1
      const lastId = this.doctors[lastIndex].id
      const newDoctor : GetDoctorModel = { id: lastId + 1, qunoScoreText: '', ...doctor }
      this.doctors.push(newDoctor)
      return new Promise<void>((resolve) => {
        resolve();
        });
    }

    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<[GetDoctorModel | GetDoctorModel[], number]>{
      if(id){
        const doctor = this.doctors.find(x => x.id == id) as GetDoctorModel;
        return new Promise((resolve) => {
          resolve([doctor,0]);
          });
      }
      else{
        if(orderBy === 1){
          this.doctors.sort( function( a , b){
            if(Number(a.id) > Number(b.id)) return 1;
            if(Number(a.id) < Number(b.id)) return -1;
            return 0;
        });
        }
        else{
          this.doctors.sort( function( a , b){
            if(Number(a.id) < Number(b.id)) return 1;
            if(Number(a.id) > Number(b.id)) return -1;
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

