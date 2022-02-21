import express from "express";
import { QueryFailedError } from "typeorm";
import { loadDatabase } from "../setup/db_init";
import AnalyticsRouter from "./analytics.router"
import TransactionRouter from "./transaction.router"

const router = express.Router();

// A helper route to load the database with users and transactions
router.get("/loadDatabase", async (req, res) => {
    let dbRes = await loadDatabase();
    if (dbRes instanceof QueryFailedError){
        res.status(400).send(dbRes);
    }
    else {
        res.status(200).send(dbRes);
    }
})

router.use('/analytics', AnalyticsRouter);
router.use("/transactions", TransactionRouter);

export default router;
