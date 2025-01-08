import axios from "axios";
import { axiosPrivate } from "../common/axiosPrivate";
import { axiosPublic } from "../common/axiosPublic";

export const login = async (value) =>
  await axios.post("/api/route.php?service=auth", value);

export const user = async () => await axiosPrivate.get("/api/route.php?service=auth");
