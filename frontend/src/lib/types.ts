export type Choice = {
    id?: number;
    choiceTxt: string;
    voteCount?: number;
};

export type Poll = {
    id?: number;
    question: string;
    description?: string;
    choiceSet: Choice[];
    createdAt: string;
    deadline: string;
    isActive?: boolean;
    allowsMultipleChoices: boolean;
    user?: string;
};

export type User = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type SignupFormData = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (data: LoginFormData) => Promise<void>;
    logout: () => void;
};

export type LoginFormData = {
    username: string;
    password: string;
};

export type TokenResponse = {
    access: string;
    refresh: string;
};


export interface FormatOptions {
    showSimpleExpiredLabel?: boolean;
    format?: "relative" | "absolute" | "both";
}

export type UserStats = {
    totalPolls: number;
    activePolls: number;
    expiredPolls: number;
    totalVotes: number;
    dateJoined: string;
};
