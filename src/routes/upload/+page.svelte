<script lang="ts">
	import { onMount } from 'svelte';

	let selectedImage: File | null = null;
	let uploadMessage = '';
	let imageSources: string[] = [];

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		selectedImage = input.files ? input.files[0] : null;
	}

	async function uploadImage() {
		if (!selectedImage) {
			uploadMessage = 'Please select image';
			return;
		}

		const formData = new FormData();
		formData.append('image', selectedImage);

		try {
			const response = await fetch('/uploads', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				uploadMessage = result.message + ' Url: ' + result.image.fileName;
			} else {
				uploadMessage = 'Upload failed' + result.error;
			}
		} catch (error) {
			uploadMessage = 'Error uploading image: ' + (error as Error).message;
		}
	}

	async function fetchImages() {
		try {
			const response = await fetch('/uploads');
			const result = await response.json();

			if (!response.ok) {
				uploadMessage = 'Failed to fetch image ' + result.error;
			}
			imageSources = result.files;
		} catch (error) {
			uploadMessage = 'Error fetching images ' + (error as Error).message;
		}
	}

	onMount(() => {
		fetchImages();
	});
</script>

<div class="container mx-auto my-4">
	<label class="label mt-2"
		><span>Upload Image</span><input
			class="input"
			type="file"
			accept="image/*"
			on:change={handleFileChange}
		/></label
	>

	<button class="variant-filled-primary btn mt-4" on:click={uploadImage}>Upload Image</button>
	<p>{uploadMessage}</p>

	{#if imageSources && imageSources.length > 0}
		<div class="mt-4 grid grid-cols-4 gap-4">
			{#each imageSources as src}
				<img {src} alt="uploadedImage" style="max-width: 200px; max-height: 200px" />
			{/each}
		</div>
	{/if}
</div>
