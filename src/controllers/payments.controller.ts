import { Request, Response } from 'express';
import paymentService from '../services/payments.services';

export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.getPaymentById(id as string);
    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message});
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const newEntry = await paymentService.pay(req.body);
    res.status(201).json(newEntry)
  } catch (error: any) {
    res.status(500).json({ error: error.message});
  }
};
