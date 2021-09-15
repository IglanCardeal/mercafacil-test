import { Request, Response } from "./http-port";

export interface Controller {
  handle: (request: Request) => Promise<Response>;
}