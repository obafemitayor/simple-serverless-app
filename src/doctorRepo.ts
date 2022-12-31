import { IDatabaseProvider } from "./databaseProvider";
import { SNS } from "aws-sdk";
import { DoctorModel } from "./models/doctor";

export class DoctorRepository{
    protected databaseProvider:IDatabaseProvider;

    constructor(databaseProvider:IDatabaseProvider) { 
        this.databaseProvider = databaseProvider
     }

     async createDoctor(doctor: DoctorModel){
      // validate fields
      this.validateCreateDoctorFields(doctor)
      /*publish data to AWS SNS subscriber. I am using asynchronous approach (implemented with a pub sub pattern)
      to handle this because the database handles writes slowly and a response has to be returned quickly*/
      await this.publishSnsTopic(doctor)
     }

     async getDoctor(limit: number, offset: number, orderBy: number, id?: number){
      //Validate Parameters
      this.validateGetDoctorFields(limit,offset,orderBy,id)
      const doctors = await this.databaseProvider.getDoctors(limit,offset,orderBy,id)
      return doctors
     }

     protected validateCreateDoctorFields(doctor: DoctorModel){
        if(!doctor.name){
         throw new ValidationError(400, 'Name cannot be empty')
        }
        if(!doctor.city){
         throw new ValidationError(400, 'Doctor must be in a city')
        }
        if(!doctor.country){
         throw new ValidationError(400, 'Doctor must be in a country')
        }
        if(!isNaN(doctor.quno_score_number)){
         throw new ValidationError(400, 'quno score number must be a number')
        }
        if(!isNaN(doctor.ratings_average)){
         throw new ValidationError(400, 'ratings average score must be a number')
        }
        if(!isNaN(doctor.treatments_last_year)){
         throw new ValidationError(400, 'treatments last year must be a number')
        }
        if(!isNaN(doctor.years_experience)){
         throw new ValidationError(400, 'years of experience must be a number')
        }
        if(!isNaN(doctor.base_price)){
         throw new ValidationError(400, 'base price must be a number')
        }
     }

     private validateGetDoctorFields(limit: number, offset: number, orderBy: number, id?: number){
      if(!isNaN(limit)){
         throw new ValidationError(400, 'Limit must be a Number')
      }
      if(!isNaN(offset)){
         throw new ValidationError(400, 'Offset must be a Number')
      }
      if(!isNaN(orderBy)){
         throw new ValidationError(400, 'orderBy must be a Number')
      }
      if(orderBy !== 1 || orderBy !== -(1)){
         throw new ValidationError(400, 'orderBy must either be 1 or -1')
      }
      if(id && !isNaN(id)){
         throw new ValidationError(400, 'id must be a number')
      }
   }

     private async publishSnsTopic (doctor: DoctorModel) {
      const sns = new SNS({ region: 'eu-central-1' })
      const params = {
        Message: JSON.stringify(doctor),
        TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:create-doctor-topic`
      }
      return sns.publish(params).promise()
    }
}

export class MockDoctorRepository extends DoctorRepository{

   async createDoctor(doctor: DoctorModel){
      // validate fields
      this.validateCreateDoctorFields(doctor)
      // add record to database
      this.databaseProvider.createDoctor(doctor)
     }
}

 class ValidationError extends Error {
   statusCode : number
   constructor(statusCode: number, message: any) {
     super(message);
     this.statusCode = statusCode;
   }
 }