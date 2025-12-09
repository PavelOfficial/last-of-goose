import { createApi } from "@reduxjs/toolkit/query/react"

import { baseQuery } from "../baseQuery"

import type { User } from "domain/user";
import type { Pagination } from "../../libs/Pagination";
import type { EnhancedRoundInfo, Round, Stats } from "domain/Rounds";

export const appApi = createApi({
  reducerPath: "vdsinaAuth",
  tagTypes: ["authentificated", "rounds"],
  baseQuery,
  endpoints: (build) => {
    const authEndpoints = {
      // User groups
      authMe: build.query<User, string | null | void>({
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
      authLogout: build.mutation<unknown, void>({
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
      rounds: build.query<Pagination<Round>, void>({
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
      roundItem: build.query<EnhancedRoundInfo, string>({
        query: (id) => {
          return {
            url: `/rounds/${id}`,
            method: "get",
          }
        },
        providesTags: () => {
          return []
        },
      }),
      createRound: build.mutation<Round, void>({
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
      roundTap: build.mutation<Stats, string>({
        query: (id) => {
          return {
            url: `/rounds/${id}/tap`,
            method: "post",
          }
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
  useRoundItemQuery,
  useAuthMeQuery,
  useAuthLoginMutation,
  useAuthLogoutMutation,
  useCreateRoundMutation,
  useRoundTapMutation,
} = appApi;
