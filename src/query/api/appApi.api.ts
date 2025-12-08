import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "../baseQuery"

import type { User } from "domain/user";
import type { Pagination } from "../../libs/Pagination";
import type { Round } from "domain/Rounds";

export const appApi = createApi({
  reducerPath: "vdsinaAuth",
  tagTypes: ["authentificated", "rounds"],
  baseQuery,
  endpoints: (build) => {
    const authEndpoints = {
      // User groups
      authMe: build.query<User, string | null | undefined>({
        query: (_)=> {
          return {
            url: `/auth/me`,
            method: "get",
          }
        },
        providesTags: () => {
          return ["authentificated"]
        },
      }),
      authLogin: build.mutation<User, { 
          username: string,
          password: string 
        }>({
        query: ({ 
          username,
          password 
        }) => {
          return {
            url: "/auth/login",
            method: "post",
            data: { 
              username,
              password
            },
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
      rounds: build.query<Pagination<Round>, unknown>({
        query: () => {
          return {
            url: `/rounds`,
            method: "get",
          }
        },
        providesTags: () => {
          return ["rounds"]
        },
      }),
      createRound: build.mutation<Round, unknown>({
        query: () => {
          return {
            url: `/rounds`,
            method: "post",
          }
        },
        invalidatesTags: () => {
          return ["rounds"]
        },
      }),
    } as const

    return {
      ...authEndpoints,
    }
  },
});

export const { 
  useRoundsQuery,
  useAuthMeQuery,
  useAuthLoginMutation,
  useAuthLogoutMutation,
  useCreateRoundMutation,
} = appApi;
