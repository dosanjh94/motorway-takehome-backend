import * as dotenv from "dotenv";
import express from "express";

import { getVehicleState } from "./services/vehicleStateService"
import {param, validationResult } from 'express-validator';

dotenv.config();

if (!process.env.PORT) {
    console.log("Port must be defined in .env file");
    process.exit(1);
}

export const app = express();

export const vehicleRouter = express.Router();

vehicleRouter.get("/:vehicleId/:timestamp",
    param("vehicleId").notEmpty().isInt(),
    param("timestamp").notEmpty().isISO8601().toDate(),
    async (req, res) => {
        const validadationErrors = validationResult(req);
        if(!validadationErrors.isEmpty()) {
            res.status(400).send({ errors: validadationErrors.array() });
            return 
        }
        const lastState = new Date(Date.parse(req.params!.timestamp));
        const result = await getVehicleState(req.params!.vehicleId, lastState);
        res.status(200).send(result);
    });
//Should return 404 if vehicle not found but low on time


app.use(express.json());
app.use("/", vehicleRouter);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});