import { axiosPrivate } from "../common/axiosPrivate";

export const checkOut = async (value) =>
  await axiosPrivate.post("/api/route.php?service=orders", value);

export const listOrder = async () =>
  await axiosPrivate.get("/api/route.php?service=orders");

export const readOrder = async (id) =>
  await axiosPrivate.get("/api/route.php?service=orders&id=" + id);
