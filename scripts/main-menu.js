document.addEventListener('DOMContentLoaded', function() {
    const toolCards = document.querySelectorAll('.tool-card');
    const mainMenu = document.getElementById('main-menu');
    const canvasTool = document.getElementById('canvas-tool');
    const combineDocs = document.getElementById('combine-docs');
    const jsonify = document.getElementById('jsonify');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolName = this.getAttribute('data-tool');
            mainMenu.style.display = 'none';
            if (toolName === 'canvas') {
                canvasTool.style.display = 'block';
                combineDocs.style.display = 'none';
                jsonify.style.display = 'none';
            } else if (toolName === 'combine') {
                canvasTool.style.display = 'none';
                combineDocs.style.display = 'block';
                jsonify.style.display = 'none';
            } else if (toolName === 'jsonify') {
                canvasTool.style.display = 'none';
                combineDocs.style.display = 'none';
                jsonify.style.display = 'block';
            }
        });
    });

    // Add back buttons
    const backButtons = document.createElement('button');
    backButtons.textContent = 'Back to Main Menu';
    backButtons.classList.add('button', 'back-button');
    backButtons.addEventListener('click', function() {
        mainMenu.style.display = 'block';
        canvasTool.style.display = 'none';
        combineDocs.style.display = 'none';
        jsonify.style.display = 'none';
    });
    
    canvasTool.insertBefore(backButtons.cloneNode(true), canvasTool.firstChild);
    combineDocs.insertBefore(backButtons.cloneNode(true), combineDocs.firstChild);
    jsonify.insertBefore(backButtons.cloneNode(true), jsonify.firstChild);

    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', function() {
            mainMenu.style.display = 'block';
            canvasTool.style.display = 'none';
            combineDocs.style.display = 'none';
            jsonify.style.display = 'none';
        });
    });
});