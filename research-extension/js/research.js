async function processText(operation) {
    const buttonIdMap = {
        summarize: 'summarizeBtn',
        analyze: 'analyzeBtn',
        key_points: 'keyPointsBtn',
        questions: 'questionsBtn'
    };
    const button = document.getElementById(buttonIdMap[operation]);
    const originalText = button.textContent;
    
    try {
        button.innerHTML = '<span class="loading"></span>Processing...';
        button.disabled = true;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString()
        });

        if (!result) {
            showResult('Please select some text first', 'warning');
            return;
        }

        let requestBody = { content: result, operation: operation };
        
        if (operation === 'compare') {
            const secondText = prompt('Enter the second text to compare:');
            if (!secondText || secondText.trim() === '') {
                showResult('Please provide both texts for comparison', 'warning');
                return;
            }
            requestBody.content2 = secondText;
        }
        
        const response = await fetch('http://localhost:8080/api/research/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const text = await response.text();
        showResult(text.replace(/\n/g, '<br>'), 'success');

    } catch (error) {
        showResult('Error: ' + error.message, 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}
