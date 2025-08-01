import { connect } from "mongoose";

const iniciarMongoose = async (uri) => {
  try {
    await connect(uri);
  } catch (error) {
    console.error("Erro ao iniciar a coneção com mongo", error);
  }
};

export { iniciarMongoose };
