import axios from "axios";
import { axiosPrivate } from "../common/axiosPrivate";

export const listCategory = async () =>
  await axiosPrivate.get("/api/route.php?service=categorys");

export const readCategory = async (id) =>
  await axiosPrivate.get("/api/route.php?service=categorys&id=" + id);

export const update = async (id, value) =>
  await axiosPrivate.post("/api/route.php?service=categorys&id=" + id, value);

export const createCategory = async (value) =>
  await axios.post("/api/route.php?service=categorys", value);

export const deleteCategory = async (id) =>
  await axios.delete("/api/route.php?service=categorys&id=" + id);
