import { PostgreSQLProvider } from "./databaseProvider";

export async function createDoctor(
    event: any
  ): Promise<any> {
    // Retrieve Message From SNS
    const { data } = JSON.parse(event.Records[0].Sns.Message)
    const postgreSQLDatabaseProvider = new PostgreSQLProvider()
    // Create Doctor on PostgreSQL database
    postgreSQLDatabaseProvider.createDoctor(data)
    return 'doctor created'
  }