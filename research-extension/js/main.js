document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up event listeners');
    
    const container = document.querySelector('.container');
    const header = document.querySelector('.header h2');
    console.log('Container found:', container);
    console.log('Header found:', header);
    
    if (!container) {
        console.error('Container not found! Extension may not be loading properly.');
        return;
    }
    
    initializeNotes();
    initializeAssignments();
    initializeResearch();
    
    loadNotes();
});

function initializeNotes() {
    const saveBtn = document.getElementById('saveNotesBtn');
    const loadBtn = document.getElementById('loadNotesBtn');
    const exportBtn = document.getElementById('exportNotesBtn');
    const clearBtn = document.getElementById('clearNotesBtn');
    
    console.log('Save button found:', saveBtn);
    console.log('Load button found:', loadBtn);
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveNotes);
        console.log('Save button listener added');
    } else {
        console.error('Save button not found!');
    }
    
    if (loadBtn) {
        loadBtn.addEventListener('click', loadNotes);
        console.log('Load button listener added');
    } else {
        console.error('Load button not found!');
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportNotes);
        console.log('Export button listener added');
    } else {
        console.error('Export button not found!');
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllNotes);
        console.log('Clear notes button listener added');
    } else {
        console.error('Clear notes button not found!');
    }
}

function initializeAssignments() {
    const addAssignmentBtn = document.getElementById('addAssignmentBtn');
    const loadAssignmentsBtn = document.getElementById('loadAssignmentsBtn');
    
    if (addAssignmentBtn) {
        addAssignmentBtn.addEventListener('click', addAssignment);
        console.log('Add assignment button listener added');
    } else {
        console.error('Add assignment button not found!');
    }
    
    if (loadAssignmentsBtn) {
        loadAssignmentsBtn.addEventListener('click', loadAssignments);
        console.log('Load assignments button listener added');
    } else {
        console.error('Load assignments button not found!');
    }
    
    const assignmentList = document.getElementById('assignmentList');
    if (assignmentList) {
        assignmentList.addEventListener('click', (e) => {
            console.log('Assignment list clicked:', e.target);
            
            if (e.target.matches('.complete-btn')) {
                const assignmentId = e.target.getAttribute('data-assignment-id');
                console.log('Complete button clicked, assignment ID:', assignmentId);
                updateAssignmentStatus(assignmentId, 'completed');
            } else if (e.target.matches('.delete-btn')) {
                const assignmentId = e.target.getAttribute('data-assignment-id');
                console.log('Delete button clicked, assignment ID:', assignmentId);
                deleteAssignment(assignmentId);
            }
        });
        console.log('Assignment list event listener added');
    } else {
        console.error('Assignment list not found!');
    }
}

function initializeResearch() {
    document.getElementById('summarizeBtn').addEventListener('click', () => processText('summarize'));
    document.getElementById('analyzeBtn').addEventListener('click', () => processText('analyze'));
    document.getElementById('keyPointsBtn').addEventListener('click', () => processText('key_points'));
    document.getElementById('questionsBtn').addEventListener('click', () => processText('questions'));
}
