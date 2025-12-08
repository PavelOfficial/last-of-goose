import type { AxiosError } from "axios"

import { axios } from "./axios"
import { baseUrl } from "./baseUrl"

export const baseQuery = async (options: any, config?: any) => {
  const { url, method, data, params } = options

  try {
    const result = await axios.request({
      //
      url: `${baseUrl}${url}`,
      method,
      data,
      params,
      ...(config ?? {}),
    })

    return { data: result.data }
  } catch (axiosError) {
    const err = axiosError as AxiosError

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    }
  }
}
