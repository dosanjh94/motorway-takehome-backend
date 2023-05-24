import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const sql = new Sequelize({
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

export const getVehicleStateFromDatabase = async (vehicleId: number, lastStateDate: Date) => {
    const [results] = await sql.query(`SELECT s.state FROM "vehicles" v JOIN "stateLogs" s
        ON s."vehicleId" = v.id WHERE v.id = ${vehicleId} AND s."timestamp" < to_timestamp(${lastStateDate.getTime()/1000})
        ORDER BY s."timestamp" DESC LIMIT 1`);
    return results;
};

export default sql;