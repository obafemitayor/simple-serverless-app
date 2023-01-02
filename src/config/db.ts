import { DatabaseConfiguration } from "../models";

export const databaseConfig = JSON.parse(process.env.QUNO_DB_CONN_PROD as string)  as DatabaseConfiguration
export const testDatabaseConfig = JSON.parse(process.env.QUNO_DB_CONN_TEST as string)  as DatabaseConfiguration
