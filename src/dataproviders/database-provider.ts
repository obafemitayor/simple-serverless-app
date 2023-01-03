import { PostDoctorModel, GetDoctorModel } from "../models/index";

export interface IDatabaseProvider {
    createDoctor(data: PostDoctorModel): Promise<void>;
    getDoctors(limit: number, offset: number, orderBy: number, id?: number): Promise<[GetDoctorModel | GetDoctorModel[], number]>;
  }
  




