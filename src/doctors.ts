import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DoctorRepository } from "./doctorRepo";
import { PostgreSQLProvider } from "./databaseProvider";
import { DoctorModel } from "./models/doctor";

export async function getDoctors(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const databaseProvider = new PostgreSQLProvider()
    const doctorRepo = new DoctorRepository(databaseProvider)
    let doctors : DoctorModel | DoctorModel[]
    if(event.pathParameters?.id){
      doctors = await doctorRepo.getDoctor(Number(event.pathParameters?.limit),Number(event.pathParameters?.offset),Number(event.pathParameters?.orderby), Number(event.pathParameters?.id))
    }
    else{
      doctors = await doctorRepo.getDoctor(Number(event.pathParameters?.limit),Number(event.pathParameters?.offset),Number(event.pathParameters?.orderby))
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(doctors),
    };
  } catch (error: any) {
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: error.message ? error.message : 'An Error Occurred, Contact Admin',
    };
  }
}

export async function postDoctor(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const databaseProvider = new PostgreSQLProvider()
    const doctorRepo = new DoctorRepository(databaseProvider)
    const body = event.body as string
    const doctorPayload = JSON.parse(body) as DoctorModel
    doctorRepo.createDoctor(doctorPayload)
    return {
      statusCode: 202,
      body: `The doctor is now being created`,
    };
  } catch (error: any) {
    return {
      statusCode: error.statusCode ? error.statusCode : 500,
      body: error.message ? error.message : 'An Error Occurred, Contact Admin',
    };
  }
}
