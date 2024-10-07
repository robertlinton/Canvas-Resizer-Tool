document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    const mainMenu = document.getElementById('main-menu');
    const canvasTool = document.getElementById('canvas-tool');
    const combineDocs = document.getElementById('combine-docs');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            mainMenu.style.display = 'none';
            if (toolName === 'canvas') {
                canvasTool.style.display = 'block';
                combineDocs.style.display = 'none';
            } else if (toolName === 'combine') {
                canvasTool.style.display = 'none';
                combineDocs.style.display = 'block';
            }
        });
    });

    // Function to create a Back button
    function createBackButton() {
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Main Menu';
        backButton.classList.add('button', 'back-button');
        backButton.addEventListener('click', function() {
            mainMenu.style.display = 'block';
            canvasTool.style.display = 'none';
            combineDocs.style.display = 'none';
        });
        return backButton;
    }

    // Add Back buttons to existing tools
    canvasTool.insertBefore(createBackButton(), canvasTool.firstChild);
    combineDocs.insertBefore(createBackButton(), combineDocs.firstChild);
});
