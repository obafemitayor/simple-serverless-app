import {ResponseModel} from './response-model'
import {GetDoctorModel} from './get-doctor'

export type GetDoctorResponseModel = ResponseModel & {
    doctors: GetDoctorModel | GetDoctorModel[]
    totalNumberofRecords: number
}