import { GetDoctorModel, QuonoScoreMappingModel } from "../models/index";

export const getqunoScoreNumber = (doctors : GetDoctorModel[]) : GetDoctorModel[] => {
    // get quonoScore Mapping from Environment Variable
    const qunoScoreMapping = JSON.parse(process.env.QUNO_SCORE_MAPPING as string)  as QuonoScoreMappingModel
    doctors.forEach(doctor => {
      // Discard decimal part of Quno Score number with bitwise NOT operator.
      const qunoScoreNumber = ~~doctor.quno_score_number
      /*If qunoScoreNumber is less than 6 then set value to 0, if qunoScore is 10 then set value to 9 because 10 has the same
      rating as 9*/
      const qunoScore = qunoScoreNumber < 6 ? 0 : qunoScoreNumber === 10 ? 9 : qunoScoreNumber
      doctor.qunoScoreText = qunoScoreMapping[qunoScore]
    });
    return doctors
  }
  
  export const paginateResult = (doctors : GetDoctorModel[], offset: number, limit: number) : GetDoctorModel[] => {
    return doctors.slice((offset - 1) * limit, offset * limit)
  }