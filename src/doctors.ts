import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

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
  const body = JSON.parse(event.body)
  return {
    statusCode: 200,
    body: `Hello, ${event.pathParameters?.name || "world"}`,
  };
}
