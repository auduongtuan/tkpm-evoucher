import { Merchant } from "@prisma/client";
import axios from "axios"; // some http client lib

const endpoint = "http://localhost:8080";

export async function getAllMerchants(): Promise<Merchant[]> {
  const res = await axios.get(endpoint + "/merchants");

  return res.data;
}
