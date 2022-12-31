import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DoctorRepository } from "./doctorRepo";
import { ValidationError } from "./validationError";

export async function getDoctors(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const doctorRepo = new DoctorRepository()
    const response = await doctorRepo.getDoctor(event.pathParameters)
    return {
      statusCode: response.statusCode,
      body: JSON.stringify(response.doctors),
    };
  } catch (error) {
    return {
      statusCode: error instanceof ValidationError ? error.statusCode : 500,
      body: error instanceof ValidationError ? error.message : 'An Error Occurred, Contact Admin',
    };
  }
}

export async function postDoctor(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const databaseProvider = new PostgreSQLDatabaseProvider()
    const doctorRepo = new DoctorRepository(databaseProvider)
    const body = event.body as string
    const response = await doctorRepo.createDoctor(body)
    return {
      statusCode: response.statusCode,
      body: response.message,
    };
  } catch (error) {
    return {
      statusCode: error instanceof ValidationError ? error.statusCode : 500,
      body: error instanceof ValidationError ? error.message : 'An Error Occurred, Contact Admin',
    };
  }
}
