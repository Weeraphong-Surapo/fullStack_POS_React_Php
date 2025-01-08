import axios from "axios";
import { axiosPrivate } from "../common/axiosPrivate";

export const listProduct = async () =>
  await axiosPrivate.get("/api/route.php?service=products");

export const createProduct = async (value) =>
  await axios.post("/api/route.php?service=products", value);

export const deleteProduct = async (id) =>
  await axios.delete("/api/route.php?service=products&id=" + id);

export const updateProduct = async (value, id) =>
  await axios.post("/api/route.php?service=products&id=" + id, value);

export const readProduct = async (id) =>
  await axios.get("/api/route.php?service=products&id=" + id);
