document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imagePreview = document.getElementById('image-preview');
    const addTextButton = document.getElementById('add-text-button');
    const saveButton = document.getElementById('save-button');

    let isDragging = false;
    let text = '';
    let textX, textY;
    let offsetX, offsetY;

    imagePreview.onload = () => {
        canvas.width = imagePreview.naturalWidth;
        canvas.height = imagePreview.naturalHeight;
        drawCanvas();
    };

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagePreview, 0, 0, canvas.width, canvas.height);
        if (text) {
            const fontSize = Math.floor(canvas.height * 0.10);
            ctx.font = `${fontSize}px Arial`;
            ctx.lineWidth = 5;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            wrapText(ctx, text, textX, textY, canvas.width * 0.8, fontSize);
        }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        for (let i = 0; i < lines.length; i++) {
            context.strokeText(lines[i], x, y - (lines.length - 1) * lineHeight / 2 + i * lineHeight);
            context.fillText(lines[i], x, y - (lines.length - 1) * lineHeight / 2 + i * lineHeight);
        }
    }

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) * (canvas.width / rect.width),
            y: (evt.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function getTouchPos(canvas, touch) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) * (canvas.width / rect.width),
            y: (touch.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function isMouseOnText(mousePos) {
        const fontSize = Math.floor(canvas.height * 0.10);
        const textHeight = fontSize * 1.5; // Увеличенная высота текста
        const textWidth = ctx.measureText(text).width; // Ширина текста
        return mousePos.x > textX - textWidth / 2 && mousePos.x < textX + textWidth / 2 && mousePos.y > textY - textHeight / 2 && mousePos.y < textY + textHeight / 2;
    }

    function handleStartDrag(mousePos) {
        if (isMouseOnText(mousePos)) {
            isDragging = true;
            offsetX = mousePos.x - textX;
            offsetY = mousePos.y - textY;
        }
    }

    function handleDragging(mousePos) {
        if (isDragging) {
            textX = mousePos.x - offsetX;
            textY = mousePos.y - offsetY;
            drawCanvas();
        }
    }

    canvas.addEventListener('mousedown', (e) => {
        const mousePos = getMousePos(canvas, e);
        handleStartDrag(mousePos);
    });

    canvas.addEventListener('mousemove', (e) => {
        const mousePos = getMousePos(canvas, e);
        handleDragging(mousePos);
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touchPos = getTouchPos(canvas, e.touches[0]);
        handleStartDrag(touchPos);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchPos = getTouchPos(canvas, e.touches[0]);
        handleDragging(touchPos);
    });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });

    addTextButton.addEventListener('click', () => {
        text = prompt('Введите текст', text) || text;
        textX = canvas.width / 2;
        textY = canvas.height / 2;
        drawCanvas();
    });

    saveButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'image-with-text.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Запускаем отрисовку изображения на canvas при загрузке страницы
    if (imagePreview.complete) {
        canvas.width = imagePreview.naturalWidth;
        canvas.height = imagePreview.naturalHeight;
        drawCanvas();
    }
});
