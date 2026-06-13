function _0xC1() {
      _0xA4.clear();
      _0xA3.forEach((image, idx) => _0xA4.set(image.name, idx + 1));
      document.querySelectorAll('.image-checkbox').forEach(c => c.checked = true);
      document.querySelectorAll('.image-card').forEach(card => card.classList.add('selected'));
      _0xC5();  _0xC6();
    }

    function _0xC2() { _0xC3(); }

    function _0xC3(updateUI=true) {
      _0xA4.clear();
      if (updateUI) {
        document.querySelectorAll('.image-checkbox').forEach(c => c.checked = false);
        document.querySelectorAll('.image-card').forEach(card => card.classList.remove('selected'));
        _0xC5(); _0xC6();
      }
    }

    function _0xC4() {
      const ordered = Array.from(_0xA4.entries()).sort((a,b) => a[1]-b[1]).map(([name]) => name);
      _0xA4.clear();
      ordered.forEach((name, idx) => _0xA4.set(name, idx + 1));
    }

    function _0xC5() { document.getElementById('selected-count').textContent = `已選 (${_0xA4.size} 題)`; }

    function _0xC6() {
      document.querySelectorAll('.selection-order').forEach(el => {
        const name = el.dataset.name;
        if (_0xA4.has(name)) { el.style.display = 'flex'; el.textContent = _0xA4.get(name); }
        else el.style.display = 'none';
      });
    }

    function _0xC7() {
      for (const category in _0xA6) _0xA6[category] = [];
      document.querySelectorAll('.filter-option.selected').forEach(option => option.classList.remove('selected'));
      document.getElementById('chapter-input').value = '';
      const topicInput = document.getElementById('topic-input');
      if (topicInput) {
        topicInput.value = '';
      }
      _0xC3(false);
      document.getElementById('result-count').textContent = '0';
      _0xB9();
      _0xCE();
      _0xC5(); 
    }

    function _0xC8() {
      return Array.from(_0xA4.entries())
        .sort((a,b) => a[1]-b[1])
        .map(([name]) => _0xA3.find(img => img.name === name) || _0xA2.find(img => img.name === name))
        .filter(Boolean);
    }

    function _0xC9() {
      const active = [];
      for (const category in _0xA6) if (_0xA6[category].length) active.push(`${category}: ${_0xA6[category].join(',')}`);
      const chapter = document.getElementById('chapter-input').value.trim();
      if (chapter) active.push(`chapter: ${chapter}`);
      return active.length ? active.join(';') : 'No filters';
    }

    async function _0xCA(ceId) {
      if (!fileId) return null;
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
          return await _0xCB(blob);
        } catch (e) { console.warn('Image fetch failed:', e); }
      }
      return null;
    }

    function _0xCB(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }


    function _0xCC(dataUrl) {
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i=0; i<binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    function _0xCD(dataUrl) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
        img.onerror = () => resolve({ width: 600, height: 400 });
        img.src = dataUrl;
      });
    }

    function _0xCE() {
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
    function _0xCF() { const prompt = document.getElementById('initial-prompt'); if (prompt) prompt.style.display = 'none'; }
    function _0xD1(message) {
      const errorContainer = document.getElementById('error-container');
      errorContainer.innerHTML = message ? `<div class="error-message"><strong>錯誤:</strong> ${_0xBE(message)}</div>` : '';
    }
  