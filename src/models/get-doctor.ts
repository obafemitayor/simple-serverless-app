import {PostDoctorModel} from './post-doctor'
export type GetDoctorModel = PostDoctorModel & {
    doctor_id: number
    qunoScoreText: string
}