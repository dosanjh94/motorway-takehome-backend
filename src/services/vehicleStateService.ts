import { Sequelize } from "sequelize"
import { Cache } from "memory-cache"
import { getVehicleStateFromDatabase } from "../data/VehicleRepository"
import * as dotenv from "dotenv";
dotenv.config();

// if mutiple nodes are running this will not be a sufficent cache
// we would need a distributed cache like memcached or redis
// we would also need a sutible cache eviction policy
const memoryCache = new Cache();
const sql = new Sequelize({
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

export const getVehicleState = async (vehicleId: number, lastStateDate: Date) => {
    const hash = getHash(vehicleId, lastStateDate);
    console.log(memoryCache);

    if (memoryCache.get(hash)) {
        return memoryCache.get(hash);
    }

    const [results] = await getVehicleStateFromDatabase(vehicleId, lastStateDate)

    memoryCache.put(getHash(vehicleId, lastStateDate), results);
    return results;
}

const getHash = (vehicleId: number, lastStateDate: Date) => {
    return `${vehicleId}${lastStateDate}`
}