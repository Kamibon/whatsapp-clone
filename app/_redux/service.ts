import axios from "axios";
import { PaginatedResponse } from "../types/interfaces";

export const findAll = async <T>(
  url: string,
  id?: string,
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<T>> => {
  const fullUrl = id ? `${url}/${id}` : url;

  const params: Record<string, string> = {};

  if (page) params.page = page.toString();
  if (limit) params.limit = limit.toString();

  const { data } = await axios.get<T[]>(fullUrl, { params });

  const hasMore = data.length === limit;

  return { data, hasMore, page, limit };
};

export const findById = async <T>(
  url: string,
  id: string,
  page?: number,
  limit?: number,
): Promise<T | PaginatedResponse<T>> => {
  const fullUrl = `${url}/${id}`;

  const params: Record<string, string> = {};

  if (page) params.page = page.toString();
  if (limit) params.limit = limit.toString();

  const { data } = await axios.get<T>(fullUrl, { params });

  let hasMore = false;

  if (Array.isArray(data) && page && limit) {
    hasMore = data.length === limit;

    return { data, hasMore, page, limit };
  }

  return data;
};

export const create = async <I, O>(url: string, body: I): Promise<O> => {
  const { data } = await axios.post<O>(url, body);

  return data;
};

export const remove = async <T>(url: string, id: string): Promise<T> => {
  const { data } = await axios.delete<T>(url + "/" + id);

  return data;
};
