import dotenv from 'dotenv'

dotenv.config()

//get config from environment
export default {
  PORT: process.env.API_PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
}