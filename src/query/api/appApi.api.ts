import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "../baseQuery"

import type { User } from "domain/user";

export const appApi = createApi({
  reducerPath: "vdsinaAuth",
  tagTypes: ["authentificated"],
  baseQuery,
  endpoints: (build) => {
    const authEndpoints = {
      // User groups
      authMe: build.query<User, unknown>({
        query: () => {
          return {
            url: `/auth/me`,
            method: "get",
          }
        },
        providesTags: (_, error) => {
          if (error) {
            return []
          }

          return ["authentificated"]
        },
      }),
      authLogin: build.mutation<User, { 
          username: string,
          password: string 
        }>({
        query: (credentials) => {
          return {
            url: "/credential",
            method: "post",
            data: credentials,
          }
        },
        invalidatesTags: () => {
          return ["authentificated"]
        },
      }),
      authLogout: build.mutation<unknown, {}>({
        query: () => {
          return {
            url: `/auth/logout`,
            method: "post",
          }
        },
        invalidatesTags: () => {
          return ["authentificated"]
        },
      }),
    } as const

    return {
      ...authEndpoints,
    }
  },
})

export const { 
  useAuthMeQuery,
  useAuthLoginMutation,
  useAuthLogoutMutation,
} = appApi;
