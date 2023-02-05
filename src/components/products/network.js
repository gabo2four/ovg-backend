import { Router } from "express";
import * as Controller from "./controller";

const productRouter = Router();

productRouter.route("/").get(Controller.getProducts);
productRouter.route("/inicio").get(Controller.indexPage);
productRouter.route("/newRoom").get(Controller.createRoom);

export default productRouter;
