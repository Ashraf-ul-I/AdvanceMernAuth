import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN

if (!TOKEN) {
  console.error("Mailtrap token is missing!");
  process.exit(1);
}

export const mailtrapEmail = new MailtrapClient({ token: TOKEN });

export const sender = {
  email: "hello@demomailtrap.com",
  name: "arnob",
};

