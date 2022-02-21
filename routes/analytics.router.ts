import express from "express";
import { QueryFailedError } from "typeorm";
import AnalyticsController from "../controllers/analytics.controller";

const router = express.Router();

router.get("/", async (req, res) => {

    if (!req.query.startDate){
        res.status(400).send({"Error": "Request is missing startDate"});
        return;
    } 
    else if (!req.query.endDate){
        res.status(400).send({"Error": "Request is missing endDate"});
        return;
    } 
    else if (!req.query.userId){
        res.status(400).send({"Error": "Request is missing userId"});
        return;
    } 

    let startDate: Date = new Date(Date.parse(req.query.startDate as string));
    let endDate: Date = new Date(Date.parse(req.query.endDate as string));
    let userId: number = parseInt(req.query.userId as string);

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