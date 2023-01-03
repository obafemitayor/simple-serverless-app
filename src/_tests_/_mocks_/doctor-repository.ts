import { DoctorRepository } from "../../repositories/doctor-repository";
import {ResponseModel } from "../../models/index";
export class MockDoctorRepository extends DoctorRepository{

    async createDoctor(requestBody: string) : Promise<ResponseModel>{
       // validate fields
       const doctor = this.validateCreateDoctorFields(requestBody)
       // add record to database
       this.databaseProvider.createDoctor(doctor)
       return {statusCode: 200, message: 'Doctor created successfully'}
      }
 }