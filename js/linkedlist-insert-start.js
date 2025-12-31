let listNodes = [];
let newNodeValue = 5;
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
function renderLinkedList(nodes, newNodeState = null) {
    // newNodeState: { value, position: 'above' | 'inserting' | null }
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');
    container.innerHTML = '';
    
    if (nodes.length === 0 && !newNodeState) {
        headPointer.style.width = '0';
        container.innerHTML = '<div class="empty-state"><i class="fas fa-list"></i><p>List is empty</p></div>';
        return;
    }
    
    if (nodes.length === 0 && newNodeState) {
        headPointer.style.width = '50px';
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'linkedlist-node';
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = newNodeState.value;
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        pointerDiv.classList.add('null');
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        nodeWrapper.appendChild(nodeBox);
        container.appendChild(nodeWrapper);
        return;
    }
    
    headPointer.style.width = '50px';
    
    // Create a wrapper div for positioning
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.flexWrap = 'nowrap';
    wrapper.style.gap = '0';
    
    // Show new node above first node
    if (newNodeState && newNodeState.position === 'above') {
        const newNodeWrapper = document.createElement('div');
        newNodeWrapper.className = 'linkedlist-node new-node new-node-above';
        
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = newNodeState.value;
        
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        newNodeWrapper.appendChild(nodeBox);
        wrapper.appendChild(newNodeWrapper);
        
        // Add vertical arrow from new node to first node
        const verticalArrow = document.createElement('div');
        verticalArrow.className = 'arrow-from-new';
        wrapper.appendChild(verticalArrow);
    }
    
    // Show new node moving down (inserting state)
    if (newNodeState && newNodeState.position === 'inserting') {
        const newNodeWrapper = document.createElement('div');
        newNodeWrapper.className = 'linkedlist-node new-node new-node-inserting';
        
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = newNodeState.value;
        
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        newNodeWrapper.appendChild(nodeBox);
        wrapper.appendChild(newNodeWrapper);
        
        const arrow = document.createElement('div');
        arrow.className = 'arrow-connector';
        arrow.style.width = '50px';
        arrow.style.opacity = '1';
        wrapper.appendChild(arrow);
    }
    
    // Render existing nodes
    nodes.forEach((value, index) => {
        // Add arrow connector (except for first node if new node is inserting)
        if (index > 0 || (newNodeState && newNodeState.position === 'inserting')) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-connector';
            arrow.style.width = '50px';
            arrow.style.opacity = '1';
            wrapper.appendChild(arrow);
        }
        
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'linkedlist-node';
        if (newNodeState && newNodeState.position === 'above' && index === 0) {
            nodeWrapper.style.marginTop = '120px'; // Push down to make room for new node above
        } else {
            nodeWrapper.style.marginTop = ''; // Reset margin
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
        wrapper.appendChild(nodeWrapper);
    });
    
    container.appendChild(wrapper);
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
        newNodeState: null
    });
    
    if (listNodes.length === 0) {
        // Empty list case
        steps.push({
            type: 'insert',
            message: 'Step 2: Insert new node as head (list is empty)',
            nodes: [newNodeValue],
            newNodeState: null
        });
        return steps;
    }
    
    // Step 2: New node appears at top of head (above first node)
    steps.push({
        type: 'showAbove',
        message: 'Step 2: New node appears above the head',
        nodes: [...listNodes],
        newNodeState: { value: newNodeValue, position: 'above' }
    });
    
    // Step 3: New node's arrow points to first node (visual state)
    steps.push({
        type: 'showArrow',
        message: 'Step 3: New node\'s pointer connects to first node',
        nodes: [...listNodes],
        newNodeState: { value: newNodeValue, position: 'above' }
    });
    
    // Step 4: New node moves down to take head place
    steps.push({
        type: 'moving',
        message: 'Step 4: New node moves down to take head position',
        nodes: [...listNodes],
        newNodeState: { value: newNodeValue, position: 'inserting' }
    });
    
    // Step 5: Insert new node at start (final state)
    const newNodes = [newNodeValue, ...listNodes];
    steps.push({
        type: 'insert',
        message: 'Step 5: New node successfully inserted at the beginning',
        nodes: newNodes,
        newNodeState: null
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
        case 'showAbove':
        case 'showArrow':
        case 'moving':
        case 'insert':
            renderLinkedList(step.nodes, step.newNodeState);
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
        renderLinkedList(step.nodes, step.newNodeState);
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
    
    newNodeValue = parseInt(document.getElementById('newNodeValue').value) || 5;
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
