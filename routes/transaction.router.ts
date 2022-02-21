import express from "express";
import { QueryFailedError } from "typeorm";
import TransactionController from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", async (req, res) => {
    const controller = new TransactionController();
    const response = await controller.createTransaction(req.body);
    if (response instanceof QueryFailedError){
        return res.status(400).send({error: 'Bad Request'})
    }
    else {
        return res.send(response);
    }
});

router.post("/", async (req, res) => {
    const controller = new TransactionController();
    const response = await controller.createTransactions(req.body);
    return res.send(response);
});

router.get("/:id", async (req, res) => {
    const controller = new TransactionController();
    const response = await controller.getTransaction(req.params.id);
    if (!response) res.status(404).send({ message: "No transaction found" });
        return res.send(response);
});

export default router;