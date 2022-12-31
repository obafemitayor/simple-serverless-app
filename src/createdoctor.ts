import { PostgreSQLDatabaseProvider } from "./databaseProvider";

export async function create(
    event: any
  ): Promise<any> {
    // Retrieve Message From SNS
    const { data } = JSON.parse(event.Records[0].Sns.Message)
    const postgreSQLDatabaseProvider = new PostgreSQLDatabaseProvider()
    // Create Doctor on PostgreSQL database
    postgreSQLDatabaseProvider.createDoctor(data)
    return 'doctor created'
  }