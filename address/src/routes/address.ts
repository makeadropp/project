import { Hono } from "hono";
import { Container } from "../container";
import { authMiddleware } from "../middleware/auth";

const addressRouter = new Hono();
const addressController = Container.getAddressController();

addressRouter.use("/*", authMiddleware);
addressRouter.post("/", (c) => addressController.create(c));
addressRouter.get("/:id", (c) => addressController.list(c));



export { addressRouter };
