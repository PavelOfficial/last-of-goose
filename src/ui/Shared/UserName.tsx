import { useAuthMeQuery } from "query/api/appApi.api";

export const UserName = () => {
    const { data: user } = useAuthMeQuery();

    if (!user) {
        return null;
    }

    return user.username;
}