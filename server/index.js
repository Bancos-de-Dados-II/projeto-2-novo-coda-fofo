import { config } from "dotenv";
import { iniciarMongoose } from "./config/mongoose.js";
import { app } from "./routes/route.js";

config();

iniciarMongoose(process.env.CONNECT_DB).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`API rodando na porta ${process.env.PORT}`)
  );
});
