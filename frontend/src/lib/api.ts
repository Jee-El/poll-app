import axios from "axios";
import type { Poll, User, SignupFormData, UserStats } from "./types";

export const axiosPolls = axios.create({
    baseURL: "http://127.0.0.1:8000/polls/api/",
    withCredentials: true,
});

axiosPolls.interceptors.request.use(
    (request) => {
        const accessToken = localStorage.getItem("accessToken") || "";
        if (accessToken) {
            request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);

axiosPolls.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const response = await axios.post("auth/refresh_token/", {
                    refresh: refreshToken,
                });
                const { accessToken, newRefreshToken } = response.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                axiosPolls.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${accessToken}`;
                return axiosPolls(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export async function fetchPolls(): Promise<Poll[]> {
    const response = await axiosPolls.get("polls/");
    const polls = response.data;
    return polls;
}

export async function fetchPoll(id: string): Promise<Poll | null> {
    const response = await axiosPolls.get(`polls/${id}/`);
    const poll = response.data;
    return poll;
}

export async function fetchUser(): Promise<User | null> {
    const response = await axiosPolls.get("auth/whoami/");
    const user = response.data;
    return user;
}

export async function signupUser(data: SignupFormData): Promise<number> {
    const response = await axiosPolls.post("auth/signup/", data);
    return response.data;
}

export async function votePoll(
    pollId: string,
    choiceIds: string[]
): Promise<Poll> {
    const votes = choiceIds.map((c) => ({ poll: pollId, choice: c }));
    const response = await axiosPolls.post(`polls/vote/`, votes);
    return response.data;
}

export async function createPoll(poll: Poll): Promise<Poll> {
    const response = await axiosPolls.post("polls/create/", poll);
    return response.data;
}

export async function fetchUserStats(): Promise<UserStats> {
    const response = await axiosPolls.get("user_stats/");
    return response.data;
}
