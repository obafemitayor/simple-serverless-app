import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DoctorRepository } from "./doctorRepo";
import { PostgreSQLProvider } from "./postgreSQLProvider";

export async function getDoctors(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: `Hello, ${event.pathParameters?.name || "world"}`,
  };
}

export async function createDoctor(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  try {
    const databaseProvider = new PostgreSQLProvider()
    const doctorRepo = new DoctorRepository(databaseProvider)
    const body = JSON.parse(event.body)
    doctorRepo.createDoctor(body)
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
