let listNodes = [];
let deleteValue = 20;
let isVisualizing = false;
let isPaused = false;
let animationSteps = [];
let currentStepIndex = 0;
let speed = 5;
let animationTimeout = null;
let initialListNodes = [];

// Initialize list inputs
function updateListInputs() {
    const listSize = parseInt(document.getElementById('listSize').value) || 1;
    if (listSize < 1) {
        document.getElementById('listSize').value = 1;
        return;
    }
    const container = document.getElementById('listInputsContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < listSize; i++) {
        const item = document.createElement('div');
        item.className = 'node-input-item';
        const inputId = `listInput${i}`;
        item.innerHTML = `
            <label>Node ${i}:</label>
            <input type="number" id="${inputId}" value="${Math.floor(Math.random() * 100) + 10}">
        `;
        container.appendChild(item);
    }
}

// Render linked list
function renderLinkedList(nodes, highlightIndex = -1, highlightDelete = -1, showTemp = false, tempIndex = -1, showDeleted = false, deletedIndex = -1) {
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');
    container.innerHTML = '';
    
    if (nodes.length === 0) {
        headPointer.style.width = '0';
        container.innerHTML = '<div class="empty-state"><i class="fas fa-list"></i><p>List is empty</p></div>';
        return;
    }
    
    headPointer.style.width = '50px';
    
    nodes.forEach((value, index) => {
        // Add arrow connector (except for first node)
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-connector';
            arrow.style.width = '50px';
            arrow.style.opacity = '1';
            container.appendChild(arrow);
        }
        
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'linkedlist-node';
        
        if (highlightIndex === index) {
            nodeWrapper.classList.add('highlighted');
        }
        
        if (highlightDelete === index) {
            nodeWrapper.classList.add('delete-highlight');
        }
        
        if (showDeleted && deletedIndex === index) {
            nodeWrapper.classList.add('deleted');
        }
        
        // Add temp pointer label
        if (showTemp && tempIndex === index) {
            const tempLabel = document.createElement('div');
            tempLabel.className = 'pointer-label';
            tempLabel.textContent = 'temp';
            nodeWrapper.appendChild(tempLabel);
        }
        
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = value;
        
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        if (index === nodes.length - 1) {
            pointerDiv.classList.add('null');
        }
        
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        nodeWrapper.appendChild(nodeBox);
        container.appendChild(nodeWrapper);
    });
}

function getSpeedDelay() {
    return 1100 - (speed * 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateAnimationSteps() {
    const steps = [];
    const deleteIndex = listNodes.indexOf(deleteValue);
    
    if (deleteIndex === -1) {
        // Value not found - just show initial list
        steps.push({
            type: 'notFound',
            message: `Value ${deleteValue} not found in the list!`,
            nodes: [...listNodes],
            highlightIndex: -1,
            highlightDelete: -1,
            showTemp: false,
            tempIndex: -1,
            showDeleted: false,
            deletedIndex: -1
        });
        return steps;
    }
    
    // Step 1: Show initial list
    steps.push({
        type: 'initial',
        message: 'Step 1: Display initial linked list',
        nodes: [...listNodes],
        highlightIndex: -1,
        highlightDelete: -1,
        showTemp: false,
        tempIndex: -1,
        showDeleted: false,
        deletedIndex: -1
    });
    
    if (deleteIndex === 0) {
        // Delete head node
        steps.push({
            type: 'highlight',
            message: 'Step 2: Highlight head node to delete',
            nodes: [...listNodes],
            highlightIndex: 0,
            highlightDelete: 0,
            showTemp: false,
            tempIndex: -1,
            showDeleted: false,
            deletedIndex: -1
        });
        steps.push({
            type: 'showDelete',
            message: 'Step 3: Remove head node',
            nodes: [...listNodes],
            highlightIndex: 0,
            highlightDelete: 0,
            showTemp: false,
            tempIndex: -1,
            showDeleted: true,
            deletedIndex: 0
        });
        const newNodes = listNodes.slice(1);
        steps.push({
            type: 'delete',
            message: 'Step 4: Head node deleted successfully',
            nodes: newNodes,
            highlightIndex: -1,
            highlightDelete: -1,
            showTemp: false,
            tempIndex: -1,
            showDeleted: false,
            deletedIndex: -1
        });
        return steps;
    }
    
    // Step 2: Traverse to node before the one to delete
    for (let i = 0; i < deleteIndex - 1; i++) {
        steps.push({
            type: 'traverse',
            message: `Step ${i + 2}: Move temp pointer to next node (position ${i})`,
            nodes: [...listNodes],
            highlightIndex: i,
            highlightDelete: -1,
            showTemp: true,
            tempIndex: i,
            showDeleted: false,
            deletedIndex: -1
        });
    }
    
    // Step 3: Show temp at position before delete target
    steps.push({
        type: 'showTarget',
        message: `Step ${deleteIndex + 1}: temp points to node before target, highlight target node`,
        nodes: [...listNodes],
        highlightIndex: deleteIndex - 1,
        highlightDelete: deleteIndex,
        showTemp: true,
        tempIndex: deleteIndex - 1,
        showDeleted: false,
        deletedIndex: -1
    });
    
    // Step 4: Show deletion animation
    steps.push({
        type: 'showDelete',
        message: `Step ${deleteIndex + 2}: Remove target node`,
        nodes: [...listNodes],
        highlightIndex: deleteIndex - 1,
        highlightDelete: deleteIndex,
        showTemp: true,
        tempIndex: deleteIndex - 1,
        showDeleted: true,
        deletedIndex: deleteIndex
    });
    
    // Step 5: Remove node
    const newNodes = [...listNodes];
    newNodes.splice(deleteIndex, 1);
    steps.push({
        type: 'delete',
        message: `Step ${deleteIndex + 3}: Node deleted successfully`,
        nodes: newNodes,
        highlightIndex: -1,
        highlightDelete: -1,
        showTemp: false,
        tempIndex: -1,
        showDeleted: false,
        deletedIndex: -1
    });
    
    return steps;
}

async function executeStep() {
    if (currentStepIndex >= animationSteps.length) {
        stopVisualization();
        return;
    }
    
    const step = animationSteps[currentStepIndex];
    document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
    
    switch (step.type) {
        case 'initial':
        case 'traverse':
        case 'highlight':
        case 'showTarget':
        case 'showDelete':
        case 'delete':
        case 'notFound':
            renderLinkedList(
                step.nodes,
                step.highlightIndex,
                step.highlightDelete,
                step.showTemp,
                step.tempIndex,
                step.showDeleted,
                step.deletedIndex
            );
            break;
    }
    
    currentStepIndex++;
}

async function playAnimation() {
    if (isPaused) {
        isPaused = false;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('playBtn').disabled = true;
    }
    
    while (!isPaused && currentStepIndex < animationSteps.length) {
        await executeStep();
        if (!isPaused && currentStepIndex < animationSteps.length) {
            await sleep(getSpeedDelay());
        }
    }
    
    if (currentStepIndex >= animationSteps.length) {
        stopVisualization();
    }
}

function pauseVisualization() {
    isPaused = true;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('playBtn').disabled = false;
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
}

function resumeVisualization() {
    if (isPaused && isVisualizing) {
        playAnimation();
    }
}

function stepVisualization() {
    if (isVisualizing && currentStepIndex < animationSteps.length) {
        pauseVisualization();
        executeStep();
        updateControlButtons();
    }
}

function previousStepVisualization() {
    if (!isVisualizing || currentStepIndex <= 0) return;
    
    pauseVisualization();
    currentStepIndex--;
    
    // Show previous step
    if (currentStepIndex < animationSteps.length) {
        const step = animationSteps[currentStepIndex];
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
        renderLinkedList(
            step.nodes,
            step.highlightIndex,
            step.highlightDelete,
            step.showTemp,
            step.tempIndex,
            step.showDeleted,
            step.deletedIndex
        );
    }
    
    updateControlButtons();
}

function updateControlButtons() {
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.disabled = !isVisualizing || currentStepIndex === 0;
    }
    const stepBtn = document.getElementById('stepBtn');
    if (stepBtn) {
        stepBtn.disabled = !isVisualizing || currentStepIndex >= animationSteps.length;
    }
}

function stopVisualization() {
    isVisualizing = false;
    isPaused = false;
    currentStepIndex = 0;
    animationSteps = [];
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('stepBtn').disabled = true;
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = true;
    
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
}

function startVisualization() {
    if (isVisualizing) return;
    
    // Get list values
    const listSize = parseInt(document.getElementById('listSize').value) || 1;
    listNodes = [];
    for (let i = 0; i < listSize; i++) {
        const value = parseInt(document.getElementById(`listInput${i}`).value) || 0;
        listNodes.push(value);
    }
    
    deleteValue = parseInt(document.getElementById('deleteValue').value) || 20;
    
    // Find index of value to delete
    const deleteIndex = listNodes.indexOf(deleteValue);
    
    if (deleteIndex === -1) {
        alert('Value ' + deleteValue + ' not found in the list!');
        return;
    }
    
    initialListNodes = [...listNodes];
    
    animationSteps = generateAnimationSteps();
    currentStepIndex = 0;
    isVisualizing = true;
    isPaused = false;
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('stepBtn').disabled = false;
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = true;
    
    playAnimation();
}

function reset() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    
    stopVisualization();
    
    listNodes = [];
    updateListInputs();
    renderLinkedList(listNodes);
    document.getElementById('codeExplanation').innerHTML = '<p>Click "Start Visualization" to see the algorithm in action!</p>';
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    updateListInputs();
    renderLinkedList(listNodes);
    
    document.getElementById('startBtn').addEventListener('click', startVisualization);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('pauseBtn').addEventListener('click', pauseVisualization);
    document.getElementById('playBtn').addEventListener('click', resumeVisualization);
    document.getElementById('stepBtn').addEventListener('click', stepVisualization);
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.addEventListener('click', previousStepVisualization);
    
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        speedValue.textContent = speed;
    });
});

window.updateListInputs = updateListInputs;
