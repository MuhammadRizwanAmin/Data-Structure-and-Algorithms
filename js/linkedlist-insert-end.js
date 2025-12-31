let listNodes = [];
let newNodeValue = 40;
let isVisualizing = false;
let isPaused = false;
let animationSteps = [];
let currentStepIndex = 0;
let speed = 5;
let animationTimeout = null;
let initialListNodes = [];

// Initialize list inputs
function updateListInputs() {
    const listSize = parseInt(document.getElementById('listSize').value) || 0;
    const container = document.getElementById('listInputsContainer');
    container.innerHTML = '';
    
    if (listSize === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 0.9rem;">List is empty. New node will become the head.</p>';
        return;
    }
    
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
function renderLinkedList(nodes, tempIndex = -1, showNewNode = false, newValue = null) {
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');
    container.innerHTML = '';
    
    if (nodes.length === 0 && !showNewNode) {
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
        
        // Highlight node if temp is pointing to it
        if (tempIndex === index) {
            nodeWrapper.classList.add('highlighted');
            // Add temp pointer label above node
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
    
    // Show new node if needed
    if (showNewNode && newValue !== null) {
        const arrow = document.createElement('div');
        arrow.className = 'arrow-connector';
        arrow.style.width = '50px';
        arrow.style.opacity = '1';
        container.appendChild(arrow);
        
        const newNodeWrapper = document.createElement('div');
        newNodeWrapper.className = 'linkedlist-node new-node';
        
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = newValue;
        
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        pointerDiv.classList.add('null');
        
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        newNodeWrapper.appendChild(nodeBox);
        container.appendChild(newNodeWrapper);
    }
}

function getSpeedDelay() {
    return 1100 - (speed * 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateAnimationSteps() {
    const steps = [];
    
    // Step 1: Show initial list
    steps.push({
        type: 'initial',
        message: 'Step 1: Display initial linked list',
        nodes: [...listNodes],
        tempIndex: -1,
        showNewNode: false
    });
    
    if (listNodes.length === 0) {
        // Empty list case
        steps.push({
            type: 'showNewNode',
            message: 'Step 2: Create new node (list is empty)',
            nodes: [],
            tempIndex: -1,
            showNewNode: true,
            newValue: newNodeValue
        });
        steps.push({
            type: 'insert',
            message: 'Step 3: Insert new node as head',
            nodes: [newNodeValue],
            tempIndex: -1,
            showNewNode: false
        });
        return steps;
    }
    
    // Step 2: Show temp = head
    steps.push({
        type: 'showTemp',
        message: 'Step 2: Set temp = head (temp points to first node)',
        nodes: [...listNodes],
        tempIndex: 0,
        showNewNode: false
    });
    
    // Step 3: Move temp through the list
    for (let i = 1; i < listNodes.length; i++) {
        steps.push({
            type: 'moveTemp',
            message: `Step ${i + 2}: Move temp to next node`,
            nodes: [...listNodes],
            tempIndex: i,
            showNewNode: false
        });
    }
    
    // Step 4: Show new node
    steps.push({
        type: 'showNewNode',
        message: 'Step ' + (listNodes.length + 2) + ': Create new node',
        nodes: [...listNodes],
        tempIndex: listNodes.length - 1,
        showNewNode: true,
        newValue: newNodeValue
    });
    
    // Step 5: Insert at end
    const newNodes = [...listNodes, newNodeValue];
    steps.push({
        type: 'insert',
        message: 'Step ' + (listNodes.length + 3) + ': Connect new node at end',
        nodes: newNodes,
        tempIndex: -1,
        showNewNode: false
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
        case 'showTemp':
        case 'moveTemp':
        case 'showNewNode':
        case 'insert':
            renderLinkedList(step.nodes, step.tempIndex, step.showNewNode, step.newValue);
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
        renderLinkedList(step.nodes, step.tempIndex, step.showNewNode, step.newValue);
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
    const listSize = parseInt(document.getElementById('listSize').value) || 0;
    listNodes = [];
    for (let i = 0; i < listSize; i++) {
        const value = parseInt(document.getElementById(`listInput${i}`).value) || 0;
        listNodes.push(value);
    }
    
    newNodeValue = parseInt(document.getElementById('newNodeValue').value) || 40;
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
