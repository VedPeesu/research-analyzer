async function addAssignment() {
    const title = document.getElementById('assignmentTitle').value.trim();
    const description = document.getElementById('assignmentDescription').value.trim();
    const deadline = document.getElementById('assignmentDeadline').value;
    const priority = document.getElementById('assignmentPriority').value;
    const category = document.getElementById('assignmentCategory').value;
    const course = document.getElementById('assignmentCourse').value.trim();
    
    if (!title) {
        showResult('Please enter an assignment title', 'warning');
        return;
    }
    
    if (!deadline) {
        showResult('Please select a deadline', 'warning');
        return;
    }
    
    try {
        const assignmentData = {
            title: title,
            description: description,
            deadline: deadline,
            priority: priority,
            category: category,
            course: course || null
        };
        
        const response = await fetch('http://localhost:8080/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignmentData)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        document.getElementById('assignmentTitle').value = '';
        document.getElementById('assignmentDescription').value = '';
        document.getElementById('assignmentDeadline').value = '';
        document.getElementById('assignmentPriority').value = 'medium';
        document.getElementById('assignmentCategory').value = 'research';
        document.getElementById('assignmentCourse').value = '';
        
        showResult('Assignment added successfully!', 'success');
        loadAssignments();
        
    } catch (error) {
        showResult('Error adding assignment: ' + error.message, 'error');
    }
}

async function loadAssignments() {
    try {
        const response = await fetch('http://localhost:8080/api/assignments');
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const assignments = await response.json();
        displayAssignments(assignments);
        
    } catch (error) {
        showResult('Error loading assignments: ' + error.message, 'error');
    }
}

function displayAssignments(assignments) {
    const assignmentList = document.getElementById('assignmentList');
    
    if (assignments.length === 0) {
        assignmentList.innerHTML = '<div class="no-results">No assignments found. Add your first assignment above!</div>';
        return;
    }
    
    assignmentList.innerHTML = assignments.map(assignment => {
        const deadline = new Date(assignment.deadline).toLocaleDateString();
        const isOverdue = new Date(assignment.deadline) < new Date() && assignment.status !== 'completed';
        
        return `
            <div class="assignment-item ${isOverdue ? 'overdue' : ''}" data-assignment-id="${assignment.id}">
                <div class="assignment-header">
                    <h4 class="assignment-title">${assignment.title}</h4>
                    <span class="assignment-priority ${assignment.priority}">${assignment.priority}</span>
                </div>
                <div class="assignment-meta">
                    Due: ${deadline} | ${assignment.category} ${assignment.course ? '| ' + assignment.course : ''}
                </div>
                ${assignment.description ? `<p class="assignment-description">${assignment.description}</p>` : ''}
                <div class="assignment-actions-inline">
                    <button class="complete-btn" data-action="complete" data-assignment-id="${assignment.id}">
                        ${assignment.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button class="delete-btn" data-action="delete" data-assignment-id="${assignment.id}">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function updateAssignmentStatus(assignmentId, status) {
    try {
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        showResult('Assignment status updated!', 'success');
        loadAssignments();
        
    } catch (error) {
        showResult('Error updating assignment: ' + error.message, 'error');
    }
}

async function deleteAssignment(assignmentId) {
    console.log('Delete assignment called with ID:', assignmentId);
    
    if (!assignmentId) {
        showResult('Error: Assignment ID is missing', 'error');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this assignment?')) {
        return;
    }
    
    try {
        console.log('Sending DELETE request to:', `http://localhost:8080/api/assignments/${assignmentId}`);
        const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}`, {
            method: 'DELETE'
        });
        
        console.log('Delete response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete error response:', errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        showResult('Assignment deleted!', 'success');
        loadAssignments();
        
    } catch (error) {
        console.error('Delete assignment error:', error);
        showResult('Error deleting assignment: ' + error.message, 'error');
    }
}
