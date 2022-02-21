import express from "express";
import { QueryFailedError } from "typeorm";
import AnalyticsController from "../controllers/analytics.controller";

const router = express.Router();

router.get("/", async (req, res) => {

    let startDateParsed = Date.parse(req.query.startDate as string)
    let endDateParsed = Date.parse(req.query.endDate as string)
    let userId: number = parseInt(req.query.userId as string);

    // Input checks
    if (!req.query.startDate)
        return res.status(400).send({"Error": "Request is missing startDate"});
    if (isNaN(startDateParsed))
        return res.status(400).send({"Error": `Invalid startDate "${req.query.startDate}"`})
    if (!req.query.endDate)
        return res.status(400).send({"Error": "Request is missing endDate"});
    if (isNaN(endDateParsed))
        return res.status(400).send({"Error": `Invalid endDate "${req.query.endDate}"`})
    if (!req.query.userId)
        return res.status(400).send({"Error": "Request is missing userId"});
    if (isNaN(userId))
        return res.status(400).send({"Error": `Invalid userId "${req.query.userId}"`})

    let startDate: Date = new Date(startDateParsed);
    let endDate: Date = new Date(endDateParsed);

    const controller = new AnalyticsController();
    const response = await controller.getAnalytics(startDate, endDate, userId);
    if (response instanceof Error){
        return res.status(400).send(response.message);
    }
    else {
        return res.send(response);
    }
});

export default router;