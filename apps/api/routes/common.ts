import { FastifyPluginOptions, FastifyInstance, FastifyRequest } from "fastify";
import { IdParamsSchema, IdParamsType } from "database/schema/id";
import {
  VoucherCreateSchema,
  VoucherCreateBody,
  VoucherUpdateBody,
  VoucherUpdateSchema,
} from "database/schema/vouchers";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";
import { getApiUrl } from "../helpers/apiUrl";
const pump = util.promisify(pipeline);
async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post("/upload", async function (req, reply) {
    const data = await req.file({
      limits: {
        fileSize: 1000000,
      },
    });
    if (data) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          data.mimetype
        )
      ) {
        reply.statusCode = 400;
        throw new Error("Only jpg, jpeg, gif and png files are allowed");
      }
      let fileName = data.filename;
      let fileUploadPath = `./uploads/${fileName}`;
      if (fs.existsSync(fileUploadPath)) {
        fileName = `${Date.now()}-${data.filename}`;
        fileUploadPath = `./uploads/${fileName}`;
      }
      console.log(fileUploadPath);
      await pump(data.file, fs.createWriteStream(fileUploadPath));
      return {
        name: fileName,
        type: data.mimetype,
        url: `${getApiUrl(fastify)}/uploads/${fileName}`,
      };
    } else {
      reply.statusCode = 400;
      throw new Error("Bad request");
    }
  });
}

export default routes;
