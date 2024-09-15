document.addEventListener("DOMContentLoaded", function() {
    const keywords = [
      { word: /"([^"]*)"/g, color: '#FF5555' }, 
      { word: /\bprint\b/g, color: '#F1FA8C' },
      { word: /\bwhile\b/g, color: '#BD93F9' },
      { word: /\bfor\b/g, color: '#FF79C6' },
      { word: /\bpass\b/g, color: '#FFB86C' },
      { word: /\bbreak\b/g, color: '#50FA7B' },
      { word: /\bcontinue\b/g, color: '#8BE9FD' },
      { word: /\bif\b/g, color: '#F1FA8C' },
      { word: /\belif\b/g, color: '#BD93F9' },
      { word: /\belse\b/g, color: '#FF79C6' },
    ];
  
    const editor = document.getElementById('editor');
  
    function getCaretCharacterOffsetWithin(element) {
      let charOffset = 0;
      const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT);
      let currentNode;
      while ((currentNode = nodeIterator.nextNode())) {
        if (window.getSelection().anchorNode === currentNode) {
          charOffset += window.getSelection().anchorOffset;
          break;
        }
        charOffset += currentNode.nodeValue.length;
      }
      return charOffset;
    }
  
    function setCaretPosition(charIndex) {
      const range = document.createRange();
      range.setStart(editor, 0);
      range.collapse(true);
  
      const nodeIterator = document.createNodeIterator(editor, NodeFilter.SHOW_TEXT);
      let currentNode;
      let currentCharIndex = 0;
      while ((currentNode = nodeIterator.nextNode())) {
        const nodeLength = currentNode.nodeValue.length;
        if (currentCharIndex + nodeLength >= charIndex) {
          range.setStart(currentNode, charIndex - currentCharIndex);
          range.collapse(true);
          break;
        }
        currentCharIndex += nodeLength;
      }
  
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  
    function applySyntaxHighlighting(text) {
      return keywords.reduce((result, keyword) => 
        result.replace(keyword.word, match => 
          `<span style="color: ${keyword.color}">${match}</span>`
        ), text);
    }
  
    function updateHighlighting() {
      const cursorPosition = getCaretCharacterOffsetWithin(editor); 
      const highlightedText = applySyntaxHighlighting(editor.innerText);
      editor.innerHTML = highlightedText;
      setCaretPosition(cursorPosition); 
    }
  
    editor.addEventListener('input', () => {
      requestAnimationFrame(updateHighlighting); 
    });
  
    editor.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        const cursorPosition = getCaretCharacterOffsetWithin(editor);
        const textBeforeCursor = editor.innerText.substring(0, cursorPosition);
        const textAfterCursor = editor.innerText.substring(cursorPosition);
  
        // Insert a <br> tag for the new line
        const newLineElement = document.createElement('br');
        const range = window.getSelection().getRangeAt(0);
        range.deleteContents(); 
        range.insertNode(newLineElement);
  
        // Set the cursor after the new line
        range.setStartAfter(newLineElement);
        range.collapse(true);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
  
        requestAnimationFrame(updateHighlighting); 
      }
    });
  
    updateHighlighting(); 
  });