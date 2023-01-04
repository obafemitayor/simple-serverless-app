import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DoctorRepository } from "../repositories/doctor-repository";
import { ValidationError } from "../validationError";

const doctorRepo = new DoctorRepository()

export async function getDoctors(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const params = {
      id: event.pathParameters?.id,
      limit: event.queryStringParameters?.limit,
      offset: event.queryStringParameters?.offset,
      orderBy: event.queryStringParameters?.orderBy,
    }
    const response = await doctorRepo.getDoctor(params)
    return {
      statusCode: response.statusCode,
      body: JSON.stringify(response),
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
    const body = event.body as string
    const response = await doctorRepo.createDoctor(body)
    return {
      statusCode: response.statusCode,
      body: response.message as string,
    };
  } catch (error) {
    return {
      statusCode: error instanceof ValidationError ? error.statusCode : 500,
      body: error instanceof ValidationError ? error.message : 'An Error Occurred, Contact Admin',
    };
  }
}
