        let savedPairs = JSON.parse(localStorage.getItem('colorPairs')) || [];

        function generateColorPairs() {
            const colorGrid = document.getElementById('colorGrid');
            colorGrid.innerHTML = '';

            // Generate 3 pairs for better large screen fit
            for (let i = 0; i < 2; i++) {
                const bgColor = getRandomColor();
                const textColor = getContrastColor(bgColor);
                createColorPair(bgColor, textColor);
            }
        }

        function getRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        }

        function getContrastColor(hex) {
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? getDarkColor() : getLightColor();
        }

        function getDarkColor() {
            return `hsl(${Math.random() * 360}, ${70 + Math.random() * 30}%, ${20 + Math.random() * 15}%)`;
        }

        function getLightColor() {
            return `hsl(${Math.random() * 360}, ${70 + Math.random() * 30}%, ${80 + Math.random() * 15}%)`;
        }

        function createColorPair(bg, text) {
            const card = document.createElement('div');
            card.className = 'color-card';

            const preview = document.createElement('div');
            preview.className = 'color-preview';
            preview.style.backgroundColor = bg;

            const textElement = document.createElement('div');
            textElement.className = 'color-text';
            textElement.textContent = 'BOX';
            textElement.style.color = text;

            const codes = document.createElement('div');
            codes.className = 'color-codes';

            const bgCode = document.createElement('div');
            bgCode.className = 'color-code';
            bgCode.textContent = bg;
            bgCode.onclick = () => copyToClipboard(bg);

            const textCode = document.createElement('div');
            textCode.className = 'color-code';
            textCode.textContent = text;
            textCode.onclick = () => copyToClipboard(text);

            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-primary';
            saveBtn.textContent = 'Save';
            saveBtn.style.marginTop = 'auto';
            saveBtn.onclick = () => saveColorPair(bg, text);

            preview.appendChild(textElement);
            codes.appendChild(bgCode);
            codes.appendChild(textCode);

            card.appendChild(preview);
            card.appendChild(codes);
            card.appendChild(saveBtn);

            document.getElementById('colorGrid').appendChild(card);
        }

        function saveColorPair(bg, text) {
            const newPair = { bg, text };
            if (!savedPairs.some(pair => pair.bg === bg && pair.text === text)) {
                savedPairs.push(newPair);
                localStorage.setItem('colorPairs', JSON.stringify(savedPairs));
                renderSavedPairs();
                showNotification('Pair saved successfully');
            }
        }

        function deletePair(index) {
            savedPairs.splice(index, 1);
            localStorage.setItem('colorPairs', JSON.stringify(savedPairs));
            renderSavedPairs();
        }

        function clearSaved() {
            savedPairs = [];
            localStorage.removeItem('colorPairs');
            renderSavedPairs();
            showNotification('All pairs cleared');
        }

        function renderSavedPairs() {
            const container = document.getElementById('savedPairs');
            container.innerHTML = '';

            savedPairs.forEach((pair, index) => {
                const item = document.createElement('div');
                item.className = 'saved-item';

                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = () => deletePair(index);

                const preview = document.createElement('div');
                preview.className = 'color-preview';
                preview.style.height = '60px';
                preview.style.backgroundColor = pair.bg;
                preview.style.marginBottom = '0.5rem';

                const text = document.createElement('div');
                text.className = 'color-text';
                text.textContent = 'BOX';
                text.style.color = pair.text;
                text.style.fontSize = '1.2rem';

                const codes = document.createElement('div');
                codes.className = 'color-codes';

                const bgCode = document.createElement('div');
                bgCode.className = 'color-code';
                bgCode.textContent = pair.bg;
                bgCode.onclick = () => copyToClipboard(pair.bg);

                const textCode = document.createElement('div');
                textCode.className = 'color-code';
                textCode.textContent = pair.text;
                textCode.onclick = () => copyToClipboard(pair.text);

                preview.appendChild(text);
                codes.appendChild(bgCode);
                codes.appendChild(textCode);
                item.appendChild(deleteBtn);
                item.appendChild(preview);
                item.appendChild(codes);

                container.appendChild(item);
            });
        }

        function toggleCustomPicker() {
            const picker = document.getElementById('customPicker');
            picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
        }

        function saveCustomPair() {
            const bg = document.getElementById('bgColor').value;
            const text = document.getElementById('textColor').value;
            saveColorPair(bg, text);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text);
            showNotification('Copied: ' + text);
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        }

        // Image color picker functionality
        document.getElementById('imageInput').addEventListener('change', function (e) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    document.getElementById('bgColor').value = '#FFFFFF'; // Reset color
                    showNotification('Click image to pick color');

                    // Create temporary overlay
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = 0;
                    overlay.style.left = 0;
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.zIndex = 9999;
                    overlay.style.cursor = 'crosshair';

                    const previewImg = new Image();
                    previewImg.src = img.src;
                    previewImg.style.maxWidth = '90vw';
                    previewImg.style.maxHeight = '90vh';
                    previewImg.style.margin = 'auto';
                    previewImg.style.display = 'block';

                    overlay.appendChild(previewImg);
                    document.body.appendChild(overlay);

                    previewImg.onclick = function (e) {
                        const rect = previewImg.getBoundingClientRect();
                        const scaleX = previewImg.naturalWidth / rect.width;
                        const scaleY = previewImg.naturalHeight / rect.height;

                        const x = (e.clientX - rect.left) * scaleX;
                        const y = (e.clientY - rect.top) * scaleY;

                        const pixel = ctx.getImageData(x, y, 1, 1).data;
                        const color = `#${((1 << 24) | (pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16).slice(1)}`;
                        document.getElementById('bgColor').value = color;
                        document.body.removeChild(overlay);
                        showNotification('Selected color: ' + color);
                    };
                };
            };
            reader.readAsDataURL(e.target.files[0]);
        });

        // Initial setup
        generateColorPairs();
        renderSavedPairs();