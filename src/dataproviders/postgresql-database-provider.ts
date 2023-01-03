import { PostDoctorModel, GetDoctorModel, DatabaseConfiguration } from "../models/index";
import {IDatabaseProvider } from "./database-provider";
import {getqunoScoreNumber, paginateResult } from "../helpers/helpers";
import { databaseConfig, testDatabaseConfig } from "./config/db";

const { Pool  } = require("pg")

 export class PostgreSQLDatabaseProvider implements IDatabaseProvider{
    private databaseConfiguration : DatabaseConfiguration
    constructor() { 
      const env = process.env.QUNOENV as string
      this.databaseConfiguration = env.trim().toLowerCase() === 'test' ? testDatabaseConfig : databaseConfig
   }
    async createDoctor(data: PostDoctorModel){
      // use parameterized query to prevent SQL Injection attack
      const query = {
        text: 'INSERT INTO doctors (name,city,country,avatar_url,quno_score_number ,ratings_average,treatments_last_year,years_experience,base_price,slug) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
        values: [data.name, data.city, data.country, data.avatar_url, data.quno_score_number,data.ratings_average,data.treatments_last_year,data.years_experience,data.base_price,data.slug],
      }
      await this.queryDatabase(query)
    }

    async getDoctors(limit: number, offset: number, orderBy: number, id?: number) : Promise<[GetDoctorModel | GetDoctorModel[], number]>{
      if(id){
        const query = {
          text: 'select * from doctors WHERE doctor_id=$1',
          values: [id],
        }
        const result = await this.queryDatabase(query)
        const doctors = result.rows as GetDoctorModel[]
        const doctor = getqunoScoreNumber(doctors)[0];
        return [doctor,0]
      }
      else{
        const orderByQuery = orderBy == 1 ? 'ASC' : 'DESC'
        const sql = `select * from doctors ORDER BY date_created ${orderByQuery}`
        const results = await this.queryDatabase(sql)
        const allDoctors = results.rows as GetDoctorModel[];
        // Paginate Result
        const doctors = paginateResult(allDoctors, offset, limit)

        return [getqunoScoreNumber(doctors), allDoctors.length]
      }
    }

     private async queryDatabase(query : any){
      const connectionPool = new Pool({
        user: this.databaseConfiguration.user,
        host: this.databaseConfiguration.host,
        database: this.databaseConfiguration.database,
        password: this.databaseConfiguration.password,
        port: this.databaseConfiguration.port
        })
        const res = await connectionPool.query(query)
        console.log(res)
        await connectionPool.end()
        return res
    }
  }