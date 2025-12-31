const QUEUE_CAPACITY = 8;
let queue = [];
let front = 0;
let rear = -1;
let isVisualizing = false;
let isPaused = false;
let animationSteps = [];
let currentStepIndex = 0;
let speed = 5;
let animationTimeout = null;

function initializeQueue() {
    const container = document.getElementById('queueContainer');
    container.innerHTML = '';
    
    for (let i = 0; i < QUEUE_CAPACITY; i++) {
        const slot = document.createElement('div');
        slot.className = 'queue-slot';
        slot.id = `queueSlot${i}`;
        slot.innerHTML = '<div class="slot-content"></div>';
        container.appendChild(slot);
    }
}

function updateQueueDisplay() {
    for (let i = 0; i < QUEUE_CAPACITY; i++) {
        const slot = document.getElementById(`queueSlot${i}`);
        const content = slot.querySelector('.slot-content');
        slot.classList.remove('filled', 'highlighted');
        content.textContent = '';
    }
    
    for (let i = 0; i < queue.length; i++) {
        const actualIndex = (front + i) % QUEUE_CAPACITY;
        const slot = document.getElementById(`queueSlot${actualIndex}`);
        const content = slot.querySelector('.slot-content');
        content.textContent = queue[i];
        slot.classList.add('filled');
    }
    
    updatePointers();
}

function updatePointers() {
    const frontArrow = document.getElementById('frontArrow');
    const rearArrow = document.getElementById('rearArrow');
    
    if (queue.length === 0) {
        frontArrow.style.display = 'none';
        rearArrow.style.display = 'none';
        return;
    }
    
    frontArrow.style.display = 'block';
    rearArrow.style.display = 'block';
    
    const frontSlot = document.getElementById(`queueSlot${front}`);
    const containerRect = document.getElementById('queueContainer').getBoundingClientRect();
    
    if (frontSlot) {
        const rect = frontSlot.getBoundingClientRect();
        frontArrow.style.left = (rect.left + rect.width / 2 - containerRect.left - 12) + 'px';
    }
    
    const rearSlot = document.getElementById(`queueSlot${rear}`);
    if (rearSlot) {
        const rect = rearSlot.getBoundingClientRect();
        rearArrow.style.left = (rect.left + rect.width / 2 - containerRect.left - 12) + 'px';
    }
}

function getSpeedDelay() {
    return 1100 - (speed * 100); // 100ms to 1000ms
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateAnimationSteps() {
    const steps = [];
    
    // Step 1: Check if empty
    steps.push({
        type: 'check',
        message: 'Step 1: Check if queue is empty...',
        queue: [...queue],
        front: front,
        rear: rear
    });
    
    if (queue.length === 0) {
        steps.push({
            type: 'empty',
            message: '✗ Queue is empty! Cannot get front element.',
            queue: [...queue],
            front: front,
            rear: rear
        });
        return steps;
    }
    
    const frontValue = queue[0];
    
    // Step 2: Access front element
    steps.push({
        type: 'access',
        message: 'Step 2: Access element at front position...',
        queue: [...queue],
        front: front,
        rear: rear,
        value: frontValue
    });
    
    // Step 3: Highlight and show value
    steps.push({
        type: 'highlight',
        message: `Step 3: Return front element (queue remains unchanged)`,
        queue: [...queue],
        front: front,
        rear: rear,
        value: frontValue
    });
    
    // Step 4: Complete
    steps.push({
        type: 'complete',
        message: `✓ Front element is ${frontValue}. Queue remains unchanged!`,
        queue: [...queue],
        front: front,
        rear: rear,
        value: frontValue
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
        case 'check':
            updateQueueDisplay();
            break;
            
        case 'empty':
            updateQueueDisplay();
            break;
            
        case 'access':
            updateQueueDisplay();
            break;
            
        case 'highlight':
            const frontSlot = document.getElementById(`queueSlot${step.front}`);
            frontSlot.classList.add('highlighted', 'highlight-pulse');
            updateQueueDisplay();
            document.getElementById('frontValue').textContent = step.value;
            document.getElementById('frontValueDisplay').style.display = 'block';
            // Add entrance animation to value display
            const valueDisplay = document.getElementById('frontValueDisplay');
            valueDisplay.style.animation = 'enqueueAnimation 0.6s ease forwards';
            break;
            
        case 'complete':
            updateQueueDisplay();
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
    
    // Reset to initial state
    const initialStep = animationSteps[0];
    queue = [...initialStep.queue];
    front = initialStep.front;
    rear = initialStep.rear;
    
    // Re-execute all steps up to currentStepIndex
    for (let i = 0; i < currentStepIndex; i++) {
        const step = animationSteps[i];
        switch (step.type) {
            case 'check':
                break;
            case 'access':
                break;
            case 'highlight':
                break;
        }
    }
    
    // Show current step message and state
    if (currentStepIndex < animationSteps.length) {
        const step = animationSteps[currentStepIndex];
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
        updateQueueDisplay();
        
        // Apply visual state for current step
        if (step.type === 'highlight') {
            const frontSlot = document.getElementById(`queueSlot${step.front}`);
            if (frontSlot) {
                frontSlot.classList.add('highlighted', 'highlight-pulse');
            }
            document.getElementById('frontValue').textContent = step.value;
            document.getElementById('frontValueDisplay').style.display = 'block';
        }
    } else {
        document.getElementById('frontValueDisplay').style.display = 'none';
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
    
    const initialQueueInput = document.getElementById('initialQueue').value.trim();
    
    // Parse initial queue
    if (initialQueueInput) {
        queue = initialQueueInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        if (queue.length > QUEUE_CAPACITY) {
            queue = queue.slice(0, QUEUE_CAPACITY);
        }
    } else {
        queue = [10, 20, 30, 40];
    }
    
    front = 0;
    rear = queue.length > 0 ? queue.length - 1 : -1;
    
    initializeQueue();
    updateQueueDisplay();
    document.getElementById('frontValueDisplay').style.display = 'none';
    
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
    
    queue = [];
    front = 0;
    rear = -1;
    initializeQueue();
    updateQueueDisplay();
    document.getElementById('codeExplanation').innerHTML = 
        '<p>Click "Start" to see the algorithm in action!</p>';
    document.getElementById('initialQueue').value = '10, 20, 30, 40';
    document.getElementById('frontValueDisplay').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    initializeQueue();
    updateQueueDisplay();
    
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
