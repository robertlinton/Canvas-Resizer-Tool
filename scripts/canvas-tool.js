// Canvas Tool functionality
(function() {
    // Global variables
    const imageInput = document.getElementById('imageInput');
    const dropArea = document.getElementById('dropArea');
    const gallery = document.getElementById('gallery');
    const gallerySection = document.getElementById('gallerySection');
    const downloadAllButton = document.getElementById('downloadAllButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCanvasContainer = document.getElementById('modalCanvasContainer');
    const closeButton = document.querySelector('.close');
    const toast = document.getElementById('toast');
    const paginationContainer = document.getElementById('pagination');

    let images = [];
    let currentPage = 1;
    const imagesPerPage = 12;
    let currentModalIndex = 0;

    // Reusable canvas
    const processingCanvas = document.createElement('canvas');
    const processingCtx = processingCanvas.getContext('2d', { willReadFrequently: true });

    // File handling functions
    function handleFileSelect(e) {
        const files = e.target.files;
        processFiles(files);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        processFiles(files);
    }

    async function processFiles(files) {
        showToast('Processing images...');
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith('image/')) {
                try {
                    const img = await loadImage(files[i]);
                    const processedCanvas = await processImage(img);
                    images.push({ original: img, processed: processedCanvas, name: files[i].name });
                } catch (error) {
                    console.error('Error processing image:', error);
                    showToast(`Error processing ${files[i].name}: ${error.message}`);
                }
            }
        }
        updateGallery();
        showToast('Images processed successfully!');
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Image processing function
    async function processImage(img) {
        processingCanvas.width = img.width;
        processingCanvas.height = img.height;

        // Use the willReadFrequently flag to optimize performance
        const processingCtx = processingCanvas.getContext('2d', { willReadFrequently: true });
        processingCtx.drawImage(img, 0, 0);

        const imageData = processingCtx.getImageData(0, 0, processingCanvas.width, processingCanvas.height);
        const bounds = getImageBounds(imageData);

        const processedCanvas = document.createElement('canvas');
        processedCanvas.width = bounds.width;
        processedCanvas.height = bounds.height;
        const processedCtx = processedCanvas.getContext('2d');
        processedCtx.drawImage(img, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        return processedCanvas;
    }

    function getImageBounds(imageData) {
        const { width, height, data } = imageData;
        let minX = width, minY = height, maxX = 0, maxY = 0;
        const threshold = 10; // Alpha threshold for determining image bounds

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > threshold) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        return {
            left: minX,
            top: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }

    // UI update functions
    function updateGallery() {
        gallery.innerHTML = '';
        const startIndex = (currentPage - 1) * imagesPerPage;
        const endIndex = Math.min(startIndex + imagesPerPage, images.length);

        for (let i = startIndex; i < endIndex; i++) {
            const image = images[i];
            const galleryItem = createGalleryItem(image, i);
            gallery.appendChild(galleryItem);
        }

        updateGalleryVisibility();
        updatePagination();
    }

    function createGalleryItem(image, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        const img = document.createElement('img');
        img.src = image.processed.toDataURL('image/png');
        img.alt = `Image ${index + 1}`;
        imgContainer.appendChild(img);
        imgContainer.addEventListener('click', () => openModal(index));

        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = image.name;
        const sizeSpan = document.createElement('span');
        sizeSpan.textContent = `${image.processed.width}x${image.processed.height}`;
        infoContainer.appendChild(nameSpan);
        infoContainer.appendChild(sizeSpan);

        const itemActions = document.createElement('div');
        itemActions.className = 'item-actions';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.className = 'download-button';
        downloadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadImage(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteImage(index);
        });

        itemActions.appendChild(downloadButton);
        itemActions.appendChild(deleteButton);

        galleryItem.appendChild(imgContainer);
        galleryItem.appendChild(infoContainer);
        galleryItem.appendChild(itemActions);

        return galleryItem;
    }

    function updateGalleryVisibility() {
        if (images.length > 0) {
            gallerySection.style.display = 'block';
            downloadAllButton.disabled = false;
            clearAllButton.disabled = false;
        } else {
            gallerySection.style.display = 'none';
            downloadAllButton.disabled = true;
            clearAllButton.disabled = true;
        }
    }

    function updatePagination() {
        const totalPages = Math.ceil(images.length / imagesPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.className = i === currentPage ? 'button active' : 'button';
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateGallery();
                });
                paginationContainer.appendChild(pageButton);
            }
        }
    }

    function downloadImage(index) {
        const image = images[index];
        const link = document.createElement('a');
        const extension = image.name.split('.').pop().toLowerCase();
        link.download = `processed_${image.name}`;
        link.href = image.processed.toDataURL(`image/${extension === 'jpg' ? 'jpeg' : extension}`);
        link.click();
        showToast('Image downloaded successfully!');
    }

    function deleteImage(index) {
        images.splice(index, 1);
        updateGallery();
        showToast('Image deleted successfully!');
    }

    function clearAllImages() {
        images = [];
        currentPage = 1;
        updateGallery();
        showToast('All images cleared successfully!');
    }

    async function downloadAllImages() {
        if (images.length === 0) {
            showToast('No images to download.');
            return;
        }

        showToast('Preparing zip file...');
        const zip = new JSZip();
        
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const extension = image.name.split('.').pop().toLowerCase();
            const blob = await new Promise(resolve => image.processed.toBlob(resolve, `image/${extension === 'jpg' ? 'jpeg' : extension}`));
            zip.file(`processed_${image.name}`, blob);
        }

        try {
            const content = await zip.generateAsync({type: "blob"});
            const link = document.createElement('a');
            link.download = 'processed_images.zip';
            link.href = URL.createObjectURL(content);
            link.click();
            showToast('All images downloaded as zip successfully!');
        } catch (error) {
            console.error('Error creating zip file:', error);
            showToast('Error creating zip file. Please try again.');
        }
    }

    function openModal(index) {
        currentModalIndex = index;
        const image = images[currentModalIndex];
        modalTitle.textContent = image.name;
        modalCanvasContainer.innerHTML = '';
        const canvas = image.processed;
        modalCanvasContainer.appendChild(canvas);
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Event listeners
    imageInput.addEventListener('change', handleFileSelect);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    downloadAllButton.addEventListener('click', downloadAllImages);
    clearAllButton.addEventListener('click', clearAllImages);
    closeButton.addEventListener('click', closeModal);

    // Window click event to close modal
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    };

    // Initialize the page
    updateGalleryVisibility();
})();