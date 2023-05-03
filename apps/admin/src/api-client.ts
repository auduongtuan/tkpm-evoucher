import { Merchant, Campaign, Staff, Game } from "database";
import axios from "axios"; // some http client lib

const endpoint = "http://localhost:8080";

export async function getMerchants(): Promise<Merchant[]> {
  const res = await axios.get(endpoint + "/merchants");

  return res.data;
}

export async function getCampaigns(): Promise<Campaign[]> {
  const res = await axios.get(endpoint + "/campaigns");

  return res.data;
}

export async function getStores(): Promise<Campaign[]> {
  const res = await axios.get(endpoint + "/stores");

  return res.data;
}

export async function getGames(): Promise<Game[]> {
  const res = await axios.get(endpoint + "/games");

  return res.data;
}
export async function getStaffs(): Promise<Staff[]> {
  const res = await axios.get(endpoint + "/staffs");

  return res.data;
}

export async function getCategories(): Promise<Staff[]> {
  const res = await axios.get(endpoint + "/categories");

  return res.data;
}
