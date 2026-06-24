// src/config/stripe.config.ts
import Stripe from 'stripe';
import { env } from './env.config';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});