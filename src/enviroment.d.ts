import { Dialect } from "sequelize"

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: number
        DB_PORT: number
        DB_DIALECT: Dialect
        DB_USERNAME: string
        DB_PASSWORD: string
        DB_DATABASE: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}