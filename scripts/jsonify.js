// JSONify tool functionality
(function() {
    // DOM elements
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatButton = document.getElementById('formatButton');
    const indentationLevel = document.getElementById('indentationLevel');
    const copyButton = document.getElementById('copyButton');
    const downloadButton = document.getElementById('downloadButton');
    const errorMessage = document.getElementById('errorMessage');
    const toast = document.getElementById('toast');
    const outputSection = document.getElementById('output-section');

    // Event listeners
    formatButton.addEventListener('click', formatJSON);
    copyButton.addEventListener('click', copyToClipboard);
    downloadButton.addEventListener('click', downloadJSON);
    jsonInput.addEventListener('input', handleInput);

    function handleInput() {
        if (jsonInput.value.trim()) {
            formatButton.disabled = false;
        } else {
            formatButton.disabled = true;
            hideOutputSection();
        }
    }

    function formatJSON() {
        const input = jsonInput.value.trim();
        if (!input) {
            showError('Please enter some JSON to format.');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const indentation = getIndentation();
            const formatted = JSON.stringify(parsed, null, indentation);
            jsonOutput.textContent = formatted;
            showOutputSection();
            showSuccess('JSON formatted successfully!');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
            hideOutputSection();
        }
    }

    function getIndentation() {
        const value = indentationLevel.value;
        return value === 'tab' ? '\t' : parseInt(value, 10);
    }

    function copyToClipboard() {
        const output = jsonOutput.textContent;
        if (!output) {
            showError('No formatted JSON to copy.');
            return;
        }

        navigator.clipboard.writeText(output)
            .then(() => showSuccess('Copied to clipboard!'))
            .catch(err => showError('Failed to copy: ' + err));
    }

    function downloadJSON() {
        const output = jsonOutput.textContent;
        if (!output) {
            showError('No formatted JSON to download.');
            return;
        }

        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSuccess('JSON file downloaded!');
    }

    function showOutputSection() {
        outputSection.style.display = 'block';
    }

    function hideOutputSection() {
        outputSection.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        jsonOutput.textContent = '';
    }

    function showSuccess(message) {
        errorMessage.style.display = 'none';
        showToast(message);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Initialize
    handleInput();
})();