import { ConnectToDatabase } from './database'

const main = async () => {
  const connectToDb = new ConnectToDatabase()
  const connection = await connectToDb.getConnection()
  const action = process.argv[2]
  if (action == 'apply') await connection.runMigrations({ transaction: 'all' })
  if (action == 'revert') await connection.undoLastMigration({ transaction: 'all' })
}

main()
