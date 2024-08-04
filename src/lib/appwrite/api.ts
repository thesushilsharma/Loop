import { Client, ID, Account } from "appwrite";
import conf from "./config";

export class AuthService {
    client = new Client();
    account: Account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }): Promise<{ message: string }> {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                console.log("User registered!", userAccount);
                await this.logout();
                const session = await this.account.createEmailPasswordSession(
                    email,
                    password
                );
                console.log(session);
                await this.sendVerificationEmail({
                    redirectUrl: `${window.location.origin}/verify`,
                });
                return { message: "Verification email sent. Please check your inbox." };
            } else {
                // Handle the case where userAccount is not created
                return { message: "User account creation failed." };
            }
        } catch (error: any) {
            if (error.code === 409) {
                // Handle duplicate account error
                console.error(
                    "An account with the same email or phone number already exists."
                );
                return {
                    message: "An account with this email already exists. Please log in.",
                };
            } else if (
                error.message === "User (role: guests) missing scope (account)"
            ) {
                // Handle missing scope error
                console.error("Account creation failed due to missing scope: ", error);
                return { message: "Account creation failed due to missing scope." };
            } else {
                throw error;
            }
        }
    }

    async sendVerificationEmail({
        redirectUrl,
    }: {
        redirectUrl: string;
    }): Promise<any> {
        try {
            if (!redirectUrl) {
                throw new Error('Missing required parameter: "url"');
            }
            console.log(redirectUrl);
            return await this.account.createVerification(redirectUrl);
        } catch (error) {
            throw error;
        }
    }

    async verifyAccount({
        userId,
        secret,
    }: {
        userId: string;
        secret: string;
    }): Promise<any> {
        try {
            const response = await this.account.updateVerification(userId, secret);
            console.log("Verification response:", response); // Debugging line
            return response;
        } catch (error) {
            console.error("Verification failed:", error); // Debugging line
            throw error;
        }
    }

    async login({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<any> {
        try {
            await this.logout();
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser(): Promise<any | null> {
        try {
            return await this.account.get();
        } catch (error: any) {
            if (error.type === "general_unauthorized_scope") {
                // Handle the case where the user is not logged in
                console.log("User is not logged in or session has expired");
                return null;
            }
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            const user = await this.getCurrentUser();
            if (user) {
                await this.account.deleteSessions();
                console.log("User logged out successfully");
            } else {
                console.log("No user is currently logged in");
            }
        } catch (error) {
            console.log("Appwrite :: logout :: error", error);
        }
    }

    async isUserVerified(): Promise<boolean> {
        try {
            const user = await this.account.get();
            return user.emailVerification;
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
