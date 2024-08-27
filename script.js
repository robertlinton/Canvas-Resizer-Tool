// Main menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    const mainMenu = document.getElementById('main-menu');
    const canvasTool = document.getElementById('canvas-tool');
    const combineDocs = document.getElementById('combine-docs');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            if (toolName === 'canvas') {
                mainMenu.style.display = 'none';
                canvasTool.style.display = 'block';
            } else if (toolName === 'combine') {
                mainMenu.style.display = 'none';
                combineDocs.style.display = 'block';
            }
        });
    });

    // Add back buttons
    const backButtons = document.createElement('button');
    backButtons.textContent = 'Back to Main Menu';
    backButtons.classList.add('button');
    backButtons.style.position = 'fixed';
    backButtons.style.top = '10px';
    backButtons.style.left = '10px';
    backButtons.addEventListener('click', function() {
        mainMenu.style.display = 'block';
        canvasTool.style.display = 'none';
        combineDocs.style.display = 'none';
    });
    
    canvasTool.insertBefore(backButtons.cloneNode(true), canvasTool.firstChild);
    combineDocs.insertBefore(backButtons.cloneNode(true), combineDocs.firstChild);

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Back to Main Menu') {
                mainMenu.style.display = 'block';
                canvasTool.style.display = 'none';
                combineDocs.style.display = 'none';
            }
        });
    });
});

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
    const closeButton = document.getElementById('closeButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const toast = document.getElementById('toast');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const paginationContainer = document.getElementById('pagination');

    let images = [];
    let currentPage = 1;
    const imagesPerPage = 12;
    let currentModalIndex = 0;

    // Reusable canvas
    const processingCanvas = document.createElement('canvas');
    const processingCtx = processingCanvas.getContext('2d');

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
        showLoadingIndicator();
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
        hideLoadingIndicator();
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

        showLoadingIndicator();
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
        } finally {
            hideLoadingIndicator();
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
        updateModalNavigation();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function updateModalNavigation() {
        prevButton.disabled = currentModalIndex === 0;
        nextButton.disabled = currentModalIndex === images.length - 1;
    }

    function showPreviousImage() {
        if (currentModalIndex > 0) {
            openModal(currentModalIndex - 1);
        }
    }

    function showNextImage() {
        if (currentModalIndex < images.length - 1) {
            openModal(currentModalIndex + 1);
        }
    }

    function showLoadingIndicator() {
        loadingIndicator.style.display = 'block';
    }

    function hideLoadingIndicator() {
        loadingIndicator.style.display = 'none';
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
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);

    // Window click event to close modal
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Initialize the page
    updateGalleryVisibility();
})();

// Combine Docs functionality
(function() {
    const fileInput = document.getElementById('fileInput');
    const fileGrid = document.getElementById('fileGrid');
    const combineButton = document.getElementById('combineButton');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');
    const combinedContent = document.getElementById('combinedContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const clearButton = document.getElementById('clearButton');
    const dropArea = document.getElementById('dropArea');
    const combinedContentContainer = document.getElementById('combinedContentContainer');
    const toast = document.getElementById('toast');
    const modal = document.getElementById('previewModal');
    const closeButton = document.getElementsByClassName('close')[0];
    const previewFileName = document.getElementById('previewFileName');
    const previewContent = document.getElementById('previewContent');
    let files = [];

    // Event Listeners
    fileInput.addEventListener('change', (event) => handleFiles(event.target.files));
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    combineButton.addEventListener('click', combineFiles);
    downloadButton.addEventListener('click', downloadCombinedFile);
    copyButton.addEventListener('click', copyToClipboard);
    clearButton.addEventListener('click', clearFiles);
    closeButton.onclick = () => { modal.style.display = 'none'; }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Functions
    function handleFiles(fileList) {
        const duplicateFiles = [];
        let newFiles = [];
        let totalFiles = fileList.length;
        let uploadedFiles = 0;

        for (const file of fileList) {
            if (file.type === 'text/plain') {
                if (!isFileAlreadyUploaded(file)) {
                    newFiles.push(file);
                } else {
                    duplicateFiles.push(file.name);
                    console.log(`Duplicate file: ${file.name}`);
                }
            } else {
                showToast('Only text files are allowed.');
                console.log(`Invalid file type: ${file.name}`);
            }
        }

        if (newFiles.length > 0) {
            const progressInterval = setInterval(() => {
                if (uploadedFiles < newFiles.length) {
                    const file = newFiles[uploadedFiles];
                    files.push(file);
                    createFileCard(file);
                    uploadedFiles++;
                    updateFileNumbers();
                } else {
                    clearInterval(progressInterval);
                    if (duplicateFiles.length > 0) {
                        showToast(`Files "${duplicateFiles.join(', ')}" have already been uploaded.`);
                    }
                    updateButtonStates();
                    fileInput.value = '';
                }
            }, 500);
        } else if (duplicateFiles.length > 0) {
            showToast(`Files "${duplicateFiles.join(', ')}" have already been uploaded.`);
        }

        updateButtonStates();
        fileInput.value = '';
    }

    function isFileAlreadyUploaded(file) {
        return files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size && existingFile.lastModified === file.lastModified);
    }

    function createFileCard(file) {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
            <div class="file-number"></div>
            <div class="file-icon">📄</div>
            <div class="file-name">${file.name}</div>
            <button class="preview-button" title="Preview"><i class="fas fa-eye"></i></button>
            <span class="delete-icon" title="Delete"><i class="fas fa-times"></i></span>
        `;
        card.querySelector('.delete-icon').addEventListener('click', () => {
            const index = files.indexOf(file);
            if (index > -1) {
                files.splice(index, 1);
                card.remove();
                updateButtonStates();
                updateFileNumbers();
                console.log(`File removed: ${file.name}`);
            }
        });
        card.querySelector('.preview-button').addEventListener('click', () => previewFile(file));
        fileGrid.appendChild(card);
    }

    function updateFileNumbers() {
        const fileCards = fileGrid.querySelectorAll('.file-card');
        fileCards.forEach((card, index) => {
            card.querySelector('.file-number').textContent = `#${index + 1}`;
        });
    }

    function handleDragOver(event) {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    }

    function handleDragLeave(event) {
        dropArea.classList.remove('drag-over');
    }

    function handleDrop(event) {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        handleFiles(event.dataTransfer.files);
    }

    function updateButtonStates() {
        const hasFiles = files.length > 0;
        combineButton.disabled = !hasFiles;
        clearButton.disabled = !hasFiles;
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    async function combineFiles() {
        loadingIndicator.style.display = 'block';
        combinedContentContainer.style.display = 'none';
        let combined = '';
        const fileCards = fileGrid.querySelectorAll('.file-card');
        const totalFiles = fileCards.length;
        let processedFiles = 0;

        try {
            for (const card of fileCards) {
                const fileName = card.querySelector('.file-name').textContent;
                const fileNumber = card.querySelector('.file-number').textContent;
                const file = files.find(f => f.name === fileName);
                if (file) {
                    const content = await file.text();
                    combined += `${fileNumber} ${file.name}\n${content}\n\n`;
                    processedFiles++;
                    updateCombineProgress(processedFiles, totalFiles);
                }
            }
            combinedContent.value = combined.trim();
            combinedContentContainer.style.display = 'block';
            showToast('Files combined successfully!');
        } catch (error) {
            showToast('Error combining files. Please try again.');
            console.error('Error combining files:', error);
        } finally {
            loadingIndicator.style.display = 'none';
            resetCombineProgress();
        }
    }

    function updateCombineProgress(processed, total) {
        const percent = (processed / total) * 100;
        loadingIndicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Combining... ${percent.toFixed(0)}% (${processed}/${total} files)`;
    }

    function resetCombineProgress() {
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Combining...';
    }

    function downloadCombinedFile() {
        try {
            const blob = new Blob([combinedContent.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'combined_text.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('File downloaded successfully!');
        } catch (error) {
            showToast('Error downloading file. Please try again.');
            console.error('Error downloading file:', error);
        }
    }

    function copyToClipboard() {
        try {
            combinedContent.select();
            document.execCommand('copy');
            showToast('Content copied to clipboard!');
        } catch (error) {
            showToast('Error copying to clipboard. Please try again.');
            console.error('Error copying to clipboard:', error);
        }
    }

    function clearFiles() {
        files = [];
        fileGrid.innerHTML = '';
        combinedContent.value = '';
        combinedContentContainer.style.display = 'none';
        updateButtonStates();
        showToast('All files cleared.');
        console.log('All files cleared');
    }

    async function previewFile(file) {
        try {
            const content = await file.text();
            previewFileName.textContent = file.name;
            previewContent.textContent = content;
            modal.style.display = 'block';
        } catch (error) {
            showToast('Error loading file preview. Please try again.');
            console.error('Error loading file preview:', error);
        }
    }

    // Initialize Sortable
    new Sortable(fileGrid, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: updateFileNumbers
    });
})();