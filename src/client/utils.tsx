import React from "react";
import axios, { AxiosError } from "axios";
import { notification, message, Button } from "antd";
import { isDev } from "@/env_config";
import httpCodeMessage from "./lib/http-code-msg";
import { postRefresh } from "./UserHelper";

// 是否是游客
export const isVisitor = window.location.href.indexOf("admin") === -1;