import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import { configService } from '../config/config.service'

export class ConnectToDatabase {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(connectionName = 'default'): Promise<Connection> {
    let connection: Connection
    if (this.connectionManager.has(connectionName)) {
      connection = this.connectionManager.get(connectionName)
      if (!connection.isConnected) {
        connection = await connection.connect()
      }
    } else {
      const dbConfig = await configService.getTypeOrmConfig()
      connection = await createConnection({
        ...dbConfig
      } as ConnectionOptions)
    }

    return connection
  }
}
