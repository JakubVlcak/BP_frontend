<template>
    <section class="bg-gray-100 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <RouterLink to="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
                <img :src="logo" class="mr-3 h-16 w-auto sm:h-20" alt="Logo" />FIT ANALYZER
            </RouterLink>
            <div
                class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-800 dark:text-white md:text-2xl">
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <label for="username"
                                class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Your username
                            </label>
                            <input type="text" id="username" name="username"
                                class="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Enter your username" v-model="username" required>
                        </div>
                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Password
                            </label>
                            <input type="password" id="password" name="password"
                                class="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="Enter your password" v-model="password" required>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <input id="remember" type="checkbox"
                                    class="w-4 h-4 border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600">
                                <label for="remember" class="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember
                                    me</label>
                            </div>
                        </div>
                        <div class="flex justify-between gap-4">
                            <button type="submit"
                                class="w-1/2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Log in
                            </button>
                            <RouterLink to="/registerpageview" class="w-1/2">
                                <button type="button"
                                    class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Register
                                </button>
                            </RouterLink>
                        </div>

                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet?
                            <RouterLink to="/registerpageview"
                                class="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                Sign up
                            </RouterLink>
                        </p>
                        <p v-if="error" class="error-message">{{ error }}</p>
                        <p v-if="success" class="success-message">Login successful!</p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { API_URL } from "@/const";
import axios from "axios"
import logo from "@/assets/logo.png";
export default {
    data() {
        return {
            username: "",
            password: "",
            rememberMe: false,
            error: null,
            success: false,
            apiUrl: API_URL,
            logo
        };
    },
    methods: {
        async handleLogin() {
            this.error = null;
            this.success = false;

            try {
                const response = await axios.post(this.apiUrl + "/login/", {
                    username: this.username,
                    password: this.password,
                }, {
                    withCredentials: true,
                });

                const token = response.data.token;
                const username = response.data.username;
                localStorage.setItem("authToken", token);
                localStorage.setItem("username", username)

                if (this.rememberMe) {
                    localStorage.setItem("rememberedUsername", this.username);
                    localStorage.setItem("rememberedPassword", this.password);
                } else {
                    localStorage.removeItem("rememberedUsername");
                    localStorage.removeItem("rememberedPassword");
                }

                this.success = true;
                this.$router.push("/home");
            } catch (error) {
                this.error = error.response?.data?.message || "Failed to login. Please try again.";
                console.error("Login error:", error);
            }
        },
    },
    beforeMount() {
        const rememberedUsername = localStorage.getItem("rememberedUsername");
        const rememberedPassword = localStorage.getItem("rememberedPassword");

        if (rememberedUsername && rememberedPassword) {
            this.username = rememberedUsername;
            this.password = rememberedPassword;
            this.rememberMe = true;
        }
    },
};
</script>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
}

.success-message {
    color: green;
    margin-top: 10px;
}
</style>