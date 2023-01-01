import { IDatabaseProvider } from "./databaseProvider";
import { SNS } from "aws-sdk";
import { PostDoctorModel, ResponseModel, GetDoctorResponseModel } from "./models";
import { ValidationError } from "./validationError";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { PostgreSQLDatabaseProvider } from "./databaseProvider";

export class DoctorRepository{
    protected databaseProvider:IDatabaseProvider;

    constructor(databaseProvider?:IDatabaseProvider) { 
        if(databaseProvider){
         this.databaseProvider = databaseProvider
        }else{
         this.databaseProvider = new PostgreSQLDatabaseProvider()
        }
     }

     async createDoctor(requestBody: string) : Promise<ResponseModel>{
      // validate fields
      const doctor = this.validateCreateDoctorFields(requestBody)
      /*publish data to AWS SNS subscriber. I am using asynchronous approach (implemented with a pub sub pattern)
      to handle this because the database handles writes slowly and a response has to be returned quickly*/
      await this.publishSnsTopic(doctor)
      return {statusCode: 202, message: 'The doctor is now being created'}
     }

     async getDoctor(requestParams : APIGatewayProxyEventPathParameters | null) : Promise<GetDoctorResponseModel>{
      //Validate Parameters
      const requestQuery = requestParams as APIGatewayProxyEventPathParameters
      this.validateGetDoctorFields(requestQuery.limit,requestQuery.offset,requestQuery.orderBy, requestQuery.id)
      const result = await this.databaseProvider.getDoctors(Number(requestQuery.limit),Number(requestQuery.offset),Number(requestQuery.orderBy),Number(requestQuery.id))
      return {statusCode: 200, doctors: result[0], totalNumberofRecords: result[1]}
     }

     protected validateCreateDoctorFields(requestBody: string) : PostDoctorModel{
        const doctorPayload = JSON.parse(requestBody)
        if(!this.isNumber(doctorPayload.quno_score_number)){
         throw new ValidationError(400, 'quno score number must be a number')
        }
        if(!this.isNumber(doctorPayload.ratings_average)){
         throw new ValidationError(400, 'ratings average score must be a number')
        }

        if(!this.isNumber(doctorPayload.treatments_last_year)){
         throw new ValidationError(400, 'treatments last year must be a number')
        }

        if(!this.isNumber(doctorPayload.years_experience)){
         throw new ValidationError(400, 'years of experience must be a number')
        }

        if(!this.isNumber(doctorPayload.base_price)){
         throw new ValidationError(400, 'base price must be a number')
        }

        const doctor = doctorPayload as PostDoctorModel

        if(!doctor.name){
         throw new ValidationError(400, 'Name cannot be empty')
        }

        if(!doctor.city){
         throw new ValidationError(400, 'Doctor must be in a city')
        }

        if(!doctor.country){
         throw new ValidationError(400, 'Doctor must be in a country')
        }

        return doctor
     }

     private isNumber(str: string): boolean {
      if (typeof str === 'string') {
        str = str.trim()
      }
      if (str === '') {
         return false;
      }
      return !isNaN(Number(str));
    }

     private validateGetDoctorFields(limit?: string | undefined, offset?: string | undefined, orderBy?: string | undefined, id?: string | undefined){
      if(limit && !this.isNumber(limit)){
         throw new ValidationError(400, 'Limit must be a Number')
      }

      if(offset && !this.isNumber(offset)){
         throw new ValidationError(400, 'Offset must be a Number')
      }
      
      if(orderBy && !this.isNumber(orderBy)){
         throw new ValidationError(400, 'orderBy must be a Number')
      }

      if(orderBy && (Number(orderBy) !== 1 && Number(orderBy) !== -(1))){
         throw new ValidationError(400, 'orderBy must either be a 1 or -1')
      }

      if(id && !this.isNumber(id)){
         throw new ValidationError(400, 'id must be a number')
      }
   }

     private async publishSnsTopic (doctor: PostDoctorModel) {
      const sns = new SNS({ region: 'eu-central-1' })
      const params = {
        Message: JSON.stringify(doctor),
        TopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:create-doctor-topic`
      }
      return sns.publish(params).promise()
    }
}

export class MockDoctorRepository extends DoctorRepository{

   async createDoctor(requestBody: string) : Promise<ResponseModel>{
      // validate fields
      const doctor = this.validateCreateDoctorFields(requestBody)
      // add record to database
      this.databaseProvider.createDoctor(doctor)
      return {statusCode: 200, message: 'Doctor created successfully'}
     }
}