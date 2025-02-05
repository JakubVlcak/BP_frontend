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
        <button
            class="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            @click="uploadFile" :disabled="!file">
            Upload
        </button>


        <p v-if="uploading" class="text-green-600 mt-4">Uploading...</p>
        <p v-if="message" class="text-gray-700 mt-4">{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

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

                if (!token) {
                    this.message = 'Authentication token is missing.';
                    return;
                }

                const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
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