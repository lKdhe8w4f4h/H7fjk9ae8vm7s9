function selectAll() {
      selectedImages.clear();
      filteredImages.forEach((image, idx) => selectedImages.set(image.name, idx + 1));
      document.querySelectorAll('.image-checkbox').forEach(c => c.checked = true);
      document.querySelectorAll('.image-card').forEach(card => card.classList.add('selected'));
      updateSelectedCount();  updateSelectionOrderDisplay();
    }

    function selectNone() { clearSelection(); }

    function clearSelection(updateUI=true) {
      selectedImages.clear();
      if (updateUI) {
        document.querySelectorAll('.image-checkbox').forEach(c => c.checked = false);
        document.querySelectorAll('.image-card').forEach(card => card.classList.remove('selected'));
        updateSelectedCount(); updateSelectionOrderDisplay();
      }
    }

    function renumberSelectedImages() {
      const ordered = Array.from(selectedImages.entries()).sort((a,b) => a[1]-b[1]).map(([name]) => name);
      selectedImages.clear();
      ordered.forEach((name, idx) => selectedImages.set(name, idx + 1));
    }

    function updateSelectedCount() { document.getElementById('selected-count').textContent = `已選 (${selectedImages.size} 題)`; }

    function updateSelectionOrderDisplay() {
      document.querySelectorAll('.selection-order').forEach(el => {
        const name = el.dataset.name;
        if (selectedImages.has(name)) { el.style.display = 'flex'; el.textContent = selectedImages.get(name); }
        else el.style.display = 'none';
      });
    }

    function resetFilters() {
      for (const category in selectedFilters) selectedFilters[category] = [];
      document.querySelectorAll('.filter-option.selected').forEach(option => option.classList.remove('selected'));
      document.getElementById('chapter-input').value = '';
      const topicInput = document.getElementById('topic-input');
      if (topicInput) {
        topicInput.value = '';
      }
      clearSelection(false);
      document.getElementById('result-count').textContent = '0';
      imageGridHide();
      showInitialPrompt();
      updateSelectedCount(); 
    }

    function getSelectedImagesArray() {
      return Array.from(selectedImages.entries())
        .sort((a,b) => a[1]-b[1])
        .map(([name]) => filteredImages.find(img => img.name === name) || imageData.find(img => img.name === name))
        .filter(Boolean);
    }

    function getFilterInfo() {
      const active = [];
      for (const category in selectedFilters) if (selectedFilters[category].length) active.push(`${category}: ${selectedFilters[category].join(',')}`);
      const chapter = document.getElementById('chapter-input').value.trim();
      if (chapter) active.push(`chapter: ${chapter}`);
      return active.length ? active.join(';') : 'No filters';
    }

    async function getImageDataFromDrive(ceId) {
      if (!ceId) return null;
      const urls = [
        `https://drive.google.com/thumbnail?id=${encodeURIComponent(ceId)}&sz=w2000`,
        `https://drive.google.com/thumbnail?id=${encodeURIComponent(ceId)}&sz=w1000`,
        `https://drive.google.com/uc?export=view&id=${encodeURIComponent(ceId)}`
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const blob = await res.blob();
          if (!blob.type.startsWith('image/')) continue;
          return await blobToDataURL(blob);
        } catch (e) { console.warn('Image fetch failed:', e); }
      }
      return null;
    }

    function blobToDataURL(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }


    function dataUrlToUint8Array(dataUrl) {
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    function getDataUrlDimensions(dataUrl) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
        img.onerror = () => resolve({ width: 600, height: 400 });
        img.src = dataUrl;
      });
    }

    function showInitialPrompt() {
      let prompt = document.getElementById('initial-prompt');
      if (!prompt) {
        prompt = document.createElement('div');
        prompt.id = 'initial-prompt';
        prompt.className = 'initial-prompt';
        prompt.innerHTML = `<div class="prompt-content"><div class="prompt-tips"><ul><li>選擇左側的篩選項目以顯示題目</li><li>如果未顯示所有問題（1332 題），請重新載入頁面。</li><li>點擊題目以顯示另一種語言</li></ul></div></div>`;
        document.querySelector('.results').appendChild(prompt);
      }
      prompt.style.display = 'block';
    }
    function hideInitialPrompt() { const prompt = document.getElementById('initial-prompt'); if (prompt) prompt.style.display = 'none'; }
    function showError(message) {
      const errorContainer = document.getElementById('error-container');
      errorContainer.innerHTML = message ? `<div class="error-message"><strong>錯誤:</strong> ${escapeHtml(message)}</div>` : '';
    }
  