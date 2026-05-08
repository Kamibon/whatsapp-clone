import axios from "axios";

export const findAll = async <T>(url: string, id?: string): Promise<T[]> => {
  const { data } = await axios.get<T[]>(id ? url + "/" + id : url);

  return data;
};

export const findById = async <T>(url: string, id: string): Promise<T> => {
  const { data } = await axios.get<T>(url + "/" + id);

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
