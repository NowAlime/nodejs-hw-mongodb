import dotenv from 'dotenv';
import { config } from 'dotenv';

config();

export const env = (key) => {
  if (!process.env[key]) {
    throw new Error(`Missing: process.env['${key}']`);
  }
  return process.env[key];
};


