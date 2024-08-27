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