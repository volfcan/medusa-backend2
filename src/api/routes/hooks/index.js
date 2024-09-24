import { Router } from "express";

import bodyParser from "body-parser";
import middlewares from "../../middlewares";

const route = Router();

export default (app) => {
  app.use("/iyzico", route);

  route.post(
    "/hooks",

    bodyParser.raw({ type: "application/json" }),
    middlewares.wrap(require("./iyzico").default),
  );
  return app;
};
