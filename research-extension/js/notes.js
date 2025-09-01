async function saveNotes() {
    const notes = document.getElementById('notes').value;
    const tags = document.getElementById('tagInput').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const button = document.getElementById('saveNotesBtn');
    const originalText = button.textContent;
    
    console.log('Save notes clicked', { notes, tags });
    
    try {
        button.innerHTML = '<span class="loading"></span>Saving...';
        button.disabled = true;
        
        const noteData = {
            content: notes,
            tags: tags,
            timestamp: new Date().toISOString()
        };
        
        console.log('Note data to save:', noteData);
        
        chrome.storage.local.get(['researchNotes'], function(result) {
            console.log('Storage result:', result);
            let allNotes = result.researchNotes || [];
            
            if (typeof allNotes === 'string') {
                allNotes = [];
            } else if (!Array.isArray(allNotes)) {
                allNotes = [];
            }
            
            allNotes.push(noteData);
            
            console.log('All notes after adding:', allNotes);
            
            chrome.storage.local.set({ 'researchNotes': allNotes }, function() {
                console.log('Storage set complete');
                showResult('Notes saved successfully!', 'success');
            });
        });
    } catch (error) {
        console.error('Save error:', error);
        showResult('Error saving notes: ' + error.message, 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

function loadNotes() {
    console.log('Load notes clicked');
    
    chrome.storage.local.get(['researchNotes'], function(result) {
        console.log('Load storage result:', result);
        let allNotes = result.researchNotes || [];
        
        if (typeof allNotes === 'string') {
            allNotes = [];
        } else if (!Array.isArray(allNotes)) {
            allNotes = [];
        }
        
        console.log('All notes found:', allNotes);
        
        if (allNotes.length > 0) {
            const latestNote = allNotes[allNotes.length - 1];
            console.log('Loading latest note:', latestNote);
            
            const notesEl = document.getElementById('notes');
            const tagsEl = document.getElementById('tagInput');
            
            notesEl.value = latestNote.content || '';
            tagsEl.value = (latestNote.tags || []).join(', ');
            
            notesEl.focus();
            notesEl.classList.remove('flash');
            void notesEl.offsetWidth;
            notesEl.classList.add('flash');
            
            const when = new Date(latestNote.timestamp).toLocaleString();
            showResult(`Loaded latest note (${when})`, 'success');
        } else {
            console.log('No notes found');
            document.getElementById('notes').value = '';
            document.getElementById('tagInput').value = '';
            showResult('No notes found to load', 'warning');
        }
    });
}

function exportNotes() {
    console.log('Export notes clicked');
    
    chrome.storage.local.get(['researchNotes'], function(result) {
        let allNotes = result.researchNotes || [];

        if (typeof allNotes === 'string') {
            allNotes = [];
        } else if (!Array.isArray(allNotes)) {
            allNotes = [];
        }
        
        if (allNotes.length === 0) {
            showResult('No notes to export', 'warning');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalNotes: allNotes.length,
            notes: allNotes
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `research-notes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showResult(`Exported ${allNotes.length} notes successfully!`, 'success');
    });
}

function clearAllNotes() {
    console.log('Clear all notes clicked');
    
    if (!confirm('Are you sure you want to clear ALL notes? This action cannot be undone.')) {
        return;
    }
    
    chrome.storage.local.remove(['researchNotes'], function() {
        document.getElementById('notes').value = '';
        document.getElementById('tagInput').value = '';
        
        showResult('All notes cleared successfully!', 'success');
    });
}
