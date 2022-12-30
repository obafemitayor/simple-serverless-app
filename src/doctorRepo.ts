import { IDatabaseProvider } from "./databaseProvider";

export class DoctorRepository{
    private databaseProvider:IDatabaseProvider;

    constructor(databaseProvider:IDatabaseProvider) { 
        this.databaseProvider = databaseProvider
     }

     createDoctor(doctor: any){
      // validate fields
      // publish data to AWS SNS subscriber. I am using asynchronous approach (impleneted with a pub sub pattern)
      // to handle this because the database handles writes slowly and a response has to be returned quickly
     }

     private validateFields(doctor: any){
        if(!doctor.name){
      
        }
        if(!doctor.city){
      
        }
        if(!doctor.country){
      
        }
        if(!isNaN(doctor.quno_score_number)){
      
        }
        if(!isNaN(doctor.ratings_average)){
      
        }
        if(!isNaN(doctor.treatments_last_year)){
      
        }
        if(!isNaN(doctor.years_experience)){
      
        }
        if(!isNaN(doctor.base_price)){
      
        }
     }
}