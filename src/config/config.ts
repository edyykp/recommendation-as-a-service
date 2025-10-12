import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  recombeePrivateToken: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  recombeePrivateToken: process.env.RECOMBEE_PRIVATE_TOKEN || "",
};

export default config;