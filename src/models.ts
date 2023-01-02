export type DatabaseConfiguration = {
    database: string
    host: string,
    port: string,
    user: string,
    password: string
}

export type  PostDoctorModel = {
    slug: string,
    name: string,
    city: string,
    country: string,
    quno_score_number: number,
    ratings_average: number,
    treatments_last_year: number,
    years_experience: number,
    base_price: number,
    avatar_url: string
}

export type GetDoctorModel = PostDoctorModel & {
    id: number
    qunoScoreText: string
}

export type  ResponseModel = {
    statusCode: number
    message?: string,
}

export type GetDoctorResponseModel = ResponseModel & {
    doctors: GetDoctorModel | GetDoctorModel[]
    totalNumberofRecords: number
}
export type  QuonoScoreMappingModel = {
    [key: number]: string;
}