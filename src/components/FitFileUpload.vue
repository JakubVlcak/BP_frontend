<template>
    <div class="p-6 max-w-lg mx-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-700">Upload Activity File</h2>


        <div class="border-2 border-dashed border-green-500 p-8 rounded-lg bg-gray-100 text-center cursor-pointer"
            @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
            @click="selectFile" :class="{ 'bg-green-50 border-green-600': isDragging }">
            <p v-if="!file" class="text-gray-500">Drag & drop a file here or click to select one</p>
            <p v-else class="text-gray-700">{{ file.name }}</p>
        </div>
        <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept=".fit" />
        <button @click="uploadFile" :disabled="!file"
            class="mt-4 w-full bg-green-950 text-green-400 border border-green-400 border-b-1 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group cursor-pointer">
            <span
                class="bg-green-400 shadow-green-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            Upload
        </button>


        <div v-if="uploading" class="flex justify-center items-center mt-4">
            <div class="flex flex-row gap-2">
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.3s]"></div>
                <div class="w-4 h-4 rounded-full bg-black animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>
        <p v-if="message" class="text-gray-700 mt-4">{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from "@/const";
export default {
    data() {
        return {
            file: null,
            uploading: false,
            message: '',
            isDragging: false,
        };
    },
    methods: {
        handleFileChange(event) {
            this.file = event.target.files[0];
        },
        handleDrop(event) {
            const droppedFiles = event.dataTransfer.files;
            if (droppedFiles.length) {
                this.file = droppedFiles[0];
            }
            this.isDragging = false;
        },
        selectFile() {
            this.$refs.fileInput.click();
        },
        async uploadFile() {
            if (!this.file) {
                this.message = 'Please select a file to upload.';
                return;
            }

            const formData = new FormData();
            formData.append('file', this.file);

            this.uploading = true;
            this.message = '';

            try {
                const token = localStorage.getItem('authToken');
                console.log('Using Token:', token); // Log the token being sent

                if (!token) {
                    this.message = 'Authentication token is missing.';
                    return;
                }

                const response = await axios.post(`${API_URL}/upload/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Token ${token}`,
                    },
                });
                this.message = 'File uploaded successfully!';
                console.log('Upload response:', response.data);
            } catch (error) {
                this.message = 'Error uploading file.';
                console.error('Upload error:', error);
            } finally {
                this.uploading = false;
            }
        },
    },
};
</script>

<style scoped></style>