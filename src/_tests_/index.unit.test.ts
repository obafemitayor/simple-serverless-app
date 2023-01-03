
import { MockDoctorRepository } from "../_tests_/_mocks_/doctor-repository";
import { MockDataBaseProvider } from "../_tests_/_mocks_/mock-database-provider";
import { ValidationError } from "../validationError";
import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { GetDoctorModel } from "../models/index";

const databaseProvider = new MockDataBaseProvider()
databaseProvider.doctors = [
  {
    doctor_id: 1,
    qunoScoreText: "",
    slug: "dr-lay-raphael",
    name: "Dr. Lay Raphael",
    city: "Citampian",
    country: "Indonesia",
    quno_score_number: 8.5,
    ratings_average: 4.8,
    treatments_last_year: 2490,
    years_experience: 15,
    base_price: 1355.76,
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
  {
    doctor_id: 2,
    qunoScoreText: "",
    slug: "dr-wallie-lagden",
    name: "Dr. Wallie Lagden",
    city: "Roza",
    country: "Russia",
    quno_score_number: 7.1,
    ratings_average: 4.5,
    treatments_last_year: 2218,
    years_experience: 7,
    base_price: 4934.98,
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
  {
    doctor_id: 3,
    qunoScoreText: "",
    slug: "dr-monty-guinan",
    name: "Dr. Monty Guinan",
    city: "Dehui",
    country: "China",
    quno_score_number: 3.2,
    ratings_average: 4.0,
    treatments_last_year: 1980,
    years_experience: 6,
    base_price: 1244.82,
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
  {
    doctor_id: 4,
    qunoScoreText: "",
    slug: "dr-allis-outridge",
    name: "Dr. Allis Outridge",
    city: "Świnice Warckie",
    country: "Poland",
    quno_score_number: 6.8,
    ratings_average: 6.5,
    treatments_last_year: 392,
    years_experience: 11,
    base_price: 1387.41,
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  },
  {
    doctor_id: 5,
    qunoScoreText: "",
    slug: "dr-cayla-loftie",
    name: "Dr. Cayla Loftie",
    city: "El Paso",
    country: "United States",
    quno_score_number: 10.0,
    ratings_average: 4.1,
    treatments_last_year: 1270,
    years_experience: 5,
    base_price: 3715.79,
    avatar_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  }
]
const doctorRepo = new MockDoctorRepository(databaseProvider)
describe("Test Validation, Create and Retrieval Operations on Doctor Repository", () => {
  it("createDoctor should throw an error when a required string field is empty", async () => {
    try {
      const data = {
        slug: '',
        name: '',
        city: '',
        country: '',
        quno_score_number: 1.0,
        ratings_average: 1.0,
        treatments_last_year: 2010,
        years_experience: 5,
        base_price: 1,
        avatar_url: '',
      }
      const doctorPayload = JSON.stringify(data)
      await doctorRepo.createDoctor(doctorPayload)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
      const error = err as ValidationError
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Name cannot be empty')  
    }
  });

  it("createDoctor should throw an error when a required number field is not a number", async () => {
    try {
      const data = {
        slug: '',
        name: 'Tayo Obafemi',
        city: 'Lagos',
        country: 'Nigeria',
        quno_score_number: 'quno',
        ratings_average: 0,
        treatments_last_year: 0,
        years_experience: 0,
        base_price: 0,
        avatar_url: '',
      }
      const doctorPayload = JSON.stringify(data)
      await doctorRepo.createDoctor(doctorPayload)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
      const error = err as ValidationError
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('quno score number must be a number')  
    }
  });

  it("getDoctor should throw an error when a required number field is not a number", async () => {
    try {
      const requestQuery : APIGatewayProxyEventPathParameters = {
        limit: 'limit',
        offset: '1',
        orderBy: '1',
      }
      await doctorRepo.getDoctor(requestQuery)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
      const error = err as ValidationError
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Limit must be a Number')  
    }
  });

  it("getDoctor should throw an error when orderBy field is not either 1 or -1", async () => {
    try {
      const requestQuery : APIGatewayProxyEventPathParameters = {
        limit: '20',
        offset: '1',
        orderBy: '99',
      }
      await doctorRepo.getDoctor(requestQuery)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
      const error = err as ValidationError
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('orderBy must either be a 1 or -1')  
    }
  });

  it("createDoctor should create a new doctor successfully and return 200 status code", async () => {
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
    const doctorPayload = JSON.stringify(data)
    const response = await doctorRepo.createDoctor(doctorPayload)
    expect(response.statusCode).toBe(200)
    expect(response.message).toBe('Doctor created successfully')  
  });

  it("getDoctor should retrieve all records in the database successfully in ascending order with correct qunoScoreText rating", async () => {
    const requestQuery : APIGatewayProxyEventPathParameters = {
      limit: '20',
      offset: '1',
      orderBy: '1',
    }
    const result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    const doctors = result.doctors as GetDoctorModel[]
    expect(doctors.length).toBe(6)
    expect(doctors[5].doctor_id).toBe(6)
    expect(doctors[0].name).toBe('Dr. Lay Raphael')
    expect(doctors[0].qunoScoreText).toBe('Very Good')
    expect(doctors[1].name).toBe('Dr. Wallie Lagden')
    expect(doctors[1].qunoScoreText).toBe('Good')
    expect(doctors[2].name).toBe('Dr. Monty Guinan')
    expect(doctors[2].qunoScoreText).toBe('Bad')
    expect(doctors[3].name).toBe('Dr. Allis Outridge')
    expect(doctors[3].qunoScoreText).toBe('Regular')
    expect(doctors[4].name).toBe('Dr. Cayla Loftie')
    expect(doctors[4].qunoScoreText).toBe('Excelent')
    expect(doctors[5].name).toBe('Dr. Tayo Obafemi')
    expect(doctors[5].qunoScoreText).toBe('Excelent')
  });

  it("getDoctor should retrieve all records in the database successfully in descending order with correct qunoScoreText rating", async () => {
    const requestQuery : APIGatewayProxyEventPathParameters = {
      limit: '20',
      offset: '1',
      orderBy: '-1',
    }
    const result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    const doctors = result.doctors as GetDoctorModel[]
    expect(doctors.length).toBe(6)
    expect(doctors[0].name).toBe('Dr. Tayo Obafemi')
    expect(doctors[0].qunoScoreText).toBe('Excelent')
    expect(doctors[1].name).toBe('Dr. Cayla Loftie')
    expect(doctors[1].qunoScoreText).toBe('Excelent')
    expect(doctors[2].name).toBe('Dr. Allis Outridge')
    expect(doctors[2].qunoScoreText).toBe('Regular')
    expect(doctors[3].name).toBe('Dr. Monty Guinan')
    expect(doctors[3].qunoScoreText).toBe('Bad')
    expect(doctors[4].name).toBe('Dr. Wallie Lagden')
    expect(doctors[4].qunoScoreText).toBe('Good')
    expect(doctors[5].name).toBe('Dr. Lay Raphael')
    expect(doctors[5].qunoScoreText).toBe('Very Good')
  });

  it("getDoctor should return correct paginated records in the database successfully", async () => {
    const requestQuery : APIGatewayProxyEventPathParameters = {
      limit: '2',
      offset: '1',
      orderBy: '1',
    }
    let result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    expect(result.totalNumberofRecords).toBe(6)
    let doctors = result.doctors as GetDoctorModel[]
    expect(doctors.length).toBe(2)
    expect(doctors[0].name).toBe('Dr. Lay Raphael')
    expect(doctors[1].name).toBe('Dr. Wallie Lagden')
    requestQuery.offset = '2'
    result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    expect(result.totalNumberofRecords).toBe(6)
    doctors = result.doctors as GetDoctorModel[]
    expect(doctors.length).toBe(2)
    expect(doctors[0].name).toBe('Dr. Monty Guinan')
    expect(doctors[1].name).toBe('Dr. Allis Outridge')
    requestQuery.offset = '3'
    result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    expect(result.totalNumberofRecords).toBe(6)
    doctors = result.doctors as GetDoctorModel[]
    expect(doctors.length).toBe(2)
    expect(doctors[0].name).toBe('Dr. Cayla Loftie')
    expect(doctors[1].name).toBe('Dr. Tayo Obafemi')
  });

  it("getDoctor should retrieve record for doctor with specified Id", async () => {
    const doctorId = '6'
    const requestQuery : APIGatewayProxyEventPathParameters = {
      id: doctorId
    }
    const result = await doctorRepo.getDoctor(requestQuery)
    expect(result.statusCode).toBe(200)
    const doctor = result.doctors as GetDoctorModel
    expect(doctor.doctor_id).toBe(Number(doctorId))
    expect(doctor.name).toBe('Dr. Tayo Obafemi')
    expect(doctor.city).toBe('Lagos')
    expect(doctor.country).toBe('Nigeria')
    expect(doctor.qunoScoreText).toBe('Excelent')
  });

});
