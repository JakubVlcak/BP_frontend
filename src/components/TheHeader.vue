<template>
  <header class="top-0 left-0 w-full  shadow-md z-50">
    <nav class="bg-gray-900 border-gray-700 px-4 lg:px-6 py-2.5">
      <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <RouterLink to="/home" class="flex items-center">
          <img :src="logo" class="mr-3 h-16 w-auto sm:h-20" alt="Logo" />
          <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
            <span class="text-gray-400">Logged in as:</span> {{ username }}
          </span>
        </RouterLink>
        <div class="flex items-center lg:order-2">
          <RouterLink to="/loginpageview">
            <button
              class="bg-blue-950 text-blue-400 border border-blue-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
              <span
                class="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Logout
            </button>
          </RouterLink>

          <button data-collapse-toggle="mobile-menu-2" type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-300 rounded-lg lg:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-controls="mobile-menu-2" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <RouterLink to="/home">
                <a href="#"
                  class="block py-2 pr-4 pl-3 text-white rounded lg:bg-transparent lg:text-blue-400 lg:p-0 hover:text-blue-300">
                  Dashboard
                </a>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/registerpageview">
                <a href="#"
                  class="block py-2 pr-4 pl-3 text-gray-400 border-b border-gray-600 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-400 lg:p-0">
                  Register
                </a>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/calendar">
                <a href="#"
                  class="block py-2 pr-4 pl-3 text-gray-400 border-b border-gray-600 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-400 lg:p-0">
                  Calendar
                </a>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>


<script>
import logo from "@/assets/logo.png";
export default {
  data() {
    return {
      username: '', // Initialize username
      logo,
    };
  },
  methods: {
    fetchUsername() {
      // Retrieve the username from localStorage
      const username = localStorage.getItem('username');
      if (username) {
        this.username = username; // Set the username if it exists
      }
    },
  },
  mounted() {
    this.fetchUsername(); // Fetch username when the component is mounted
  },
};
</script>

<style scoped></style>