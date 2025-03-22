<template>
    <section class="bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <RouterLink to="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img :src="logo" class="mr-3 h-16 w-auto sm:h-20" alt="Logo" />FIT ANALYZER
            </RouterLink>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <label for="username"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                username</label>
                            <input type="text" name="username" id="username"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                v-model="username" placeholder="Enter your username" required>
                        </div>
                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                v-model="password" placeholder="Enter your password" required>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        v-model="rememberMe">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#"
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-gray-300">Forgot
                                password?</a>
                        </div>
                        <div class="flex justify-between">
                            <button type="submit"
                                class="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mr-2">
                                Log in
                            </button>
                            <RouterLink to="/registerpageview">
                                <button type="button"
                                    class="w-1/2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Register
                                </button>
                            </RouterLink>
                        </div>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <RouterLink to="/registerpageview"><a href="#"
                                    class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                                    up</a></RouterLink>
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