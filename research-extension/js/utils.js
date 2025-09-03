function showResult(content, type = 'info') {
    console.log('showResult called:', content, type);
    const resultsDiv = document.getElementById('results');
    console.log('Results div found:', resultsDiv);
    
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <div class="result-item ${type}">
                <div class="result-content">${content}</div>
            </div>
        `;
        console.log('Result displayed');
    } else {
        console.error('Results div not found!');
    }
}