import { APIGatewayEvent } from "aws-lambda";
import { postDoctor, getDoctors } from "../doctors";
import { GetDoctorModel, GetDoctorResponseModel } from "../models";

const event : APIGatewayEvent = {
    body: '',
    headers: {}, 
    multiValueHeaders : {}, 
    httpMethod: '', 
    isBase64Encoded: false,
    path: '', 
    pathParameters: {}, 
    queryStringParameters: {}, 
    multiValueQueryStringParameters: {},
    stageVariables: {}, 
    requestContext: {
        accountId: '', 
        apiId: '', 
        authorizer: {}, 
        protocol: '',
        httpMethod: '', 
        identity: {
            accessKey: '', 
            accountId: '', 
            apiKey: '', 
            apiKeyId: '',
            caller: '', 
            clientCert: {
                clientCertPem: '', 
                serialNumber: '', 
                subjectDN: '', 
                issuerDN: '', 
                validity: {notAfter: '', notBefore: ''},
            },
            cognitoAuthenticationProvider: '', 
            cognitoAuthenticationType: '',
            cognitoIdentityId: '', 
            cognitoIdentityPoolId: '', 
            principalOrgId: '', 
            sourceIp: '',
            user: '', 
            userAgent: '', 
            userArn: ''
        }, 
        path: '', 
        stage: '',
        requestId: '', 
        requestTimeEpoch: 0, 
        resourceId: '', 
        resourcePath: ''
    }, 
    resource: ''
  }

describe("Integration Test on GET and POST doctor handlers", () => {
  it("postDoctor handler should return HTTP 202 response code when a create doctor request is recieved", async () => {
    try {
      const data = {
        slug: 'dr-tayo-obafemi',
        name: 'Dr. Tayo Obafemi',
        city: 'Lagos',
        country: 'Nigeria',
        quno_score_number: 9.7,
        ratings_average: 4.0,
        treatments_last_year: 1390,
        years_experience: 13,
        base_price: 3651.54,
        avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      }
      event.body = JSON.stringify(data) as string
      const response = await postDoctor(event);
      event.body = ''
      expect(response.statusCode).toEqual(202);
      expect(response.body).toEqual('The doctor is now being created');
    } catch (error) {
      console.log(error)
    }
  });

  it("getDoctors handler should return list of doctors from database in ascending order", async () => {
    const data = {
        limit: '20',
        offset: '1',
        orderBy: '1',
    }
      event.pathParameters = data
      const response = await getDoctors(event);
      event.pathParameters = {}
      expect(response.statusCode).toEqual(200);
      const doctors = JSON.parse(response.body) as GetDoctorModel[]
      expect(doctors.length).toEqual(6);
      expect(doctors[5].name).toBe('Dr. Tayo Obafemi')
      expect(doctors[5].qunoScoreText).toBe('Excelent')
  });

  it("getDoctors handler should return list of doctors from database in descending order", async () => {
    const data = {
        limit: '20',
        offset: '1',
        orderBy: '-1',
    }
      event.pathParameters = data
      const response = await getDoctors(event);
      event.pathParameters = {}
      expect(response.statusCode).toEqual(200);
      const result = JSON.parse(response.body) as GetDoctorResponseModel
      const doctors = result.doctors as GetDoctorModel[]
      expect(doctors.length).toEqual(6);
      expect(doctors[0].name).toBe('Dr. Tayo Obafemi')
      expect(doctors[0].qunoScoreText).toBe('Excelent')
  });
});
