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
        slot.classList.remove('filled', 'enqueuing', 'highlighted');
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

function generateAnimationSteps(newValue) {
    const steps = [];
    
    // Step 1: Check if full
    steps.push({
        type: 'check',
        message: 'Step 1: Check if queue is full...',
        queue: [...queue],
        front: front,
        rear: rear
    });
    
    // Step 2: Update rear pointer
    const newRear = rear === -1 ? 0 : (rear + 1) % QUEUE_CAPACITY;
    steps.push({
        type: 'updateRear',
        message: 'Step 2: Update rear pointer: rear = (rear + 1) % capacity',
        queue: [...queue],
        front: front,
        rear: newRear,
        oldRear: rear
    });
    
    // Step 3: Show element entering
    steps.push({
        type: 'showEntering',
        message: 'Step 3: Element entering queue...',
        queue: [...queue],
        front: front,
        rear: newRear,
        value: newValue
    });
    
    // Step 4: Insert element
    const newQueue = [...queue, newValue];
    steps.push({
        type: 'insert',
        message: `Step 4: Insert ${newValue} at rear position`,
        queue: newQueue,
        front: newQueue.length === 1 ? 0 : front,
        rear: newRear,
        value: newValue
    });
    
    // Step 5: Complete
    steps.push({
        type: 'complete',
        message: `✓ Element ${newValue} successfully enqueued!`,
        queue: newQueue,
        front: newQueue.length === 1 ? 0 : front,
        rear: newRear
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
            
        case 'updateRear':
            rear = step.rear;
            if (queue.length === 0) front = 0;
            updateQueueDisplay();
            break;
            
        case 'showEntering':
            const slotEntering = document.getElementById(`queueSlot${step.rear}`);
            slotEntering.classList.add('enqueuing');
            // Add a temporary element to show it entering
            const tempContent = slotEntering.querySelector('.slot-content');
            tempContent.textContent = step.value;
            updatePointers();
            break;
            
        case 'insert':
            queue = [...step.queue];
            front = step.front;
            rear = step.rear;
            const slot = document.getElementById(`queueSlot${step.rear}`);
            slot.classList.remove('enqueuing');
            slot.classList.add('filled');
            slot.querySelector('.slot-content').textContent = step.value;
            // Add a brief highlight effect
            setTimeout(() => {
                slot.style.transition = 'all 0.3s ease';
                slot.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.5)';
                setTimeout(() => {
                    slot.style.boxShadow = '';
                }, 300);
            }, 100);
            updateQueueDisplay();
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
            case 'updateRear':
                rear = step.rear;
                if (queue.length === 0) front = 0;
                break;
            case 'showEntering':
                break;
            case 'insert':
                queue = [...step.queue];
                front = step.front;
                rear = step.rear;
                break;
        }
    }
    
    // Show current step message and state
    if (currentStepIndex < animationSteps.length) {
        const step = animationSteps[currentStepIndex];
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
        updateQueueDisplay();
        
        // Apply visual state for current step
        if (step.type === 'showEntering') {
            const slot = document.getElementById(`queueSlot${step.rear}`);
            if (slot) {
                slot.classList.add('enqueuing');
                slot.querySelector('.slot-content').textContent = step.value;
            }
        } else if (step.type === 'insert') {
            const slot = document.getElementById(`queueSlot${step.rear}`);
            if (slot) {
                slot.classList.remove('enqueuing');
                slot.classList.add('filled');
                slot.querySelector('.slot-content').textContent = step.value;
            }
        }
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
    const newValue = parseInt(document.getElementById('newValue').value);
    
    if (isNaN(newValue)) {
        alert('Please enter a valid number to enqueue!');
        return;
    }
    
    // Parse initial queue
    if (initialQueueInput) {
        queue = initialQueueInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        if (queue.length > QUEUE_CAPACITY - 1) {
            queue = queue.slice(0, QUEUE_CAPACITY - 1);
        }
    } else {
        queue = [];
    }
    
    if (queue.length >= QUEUE_CAPACITY) {
        alert('Queue is already full! Cannot enqueue more elements.');
        return;
    }
    
    front = queue.length > 0 ? 0 : 0;
    rear = queue.length > 0 ? queue.length - 1 : -1;
    
    initializeQueue();
    updateQueueDisplay();
    
    animationSteps = generateAnimationSteps(newValue);
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
    document.getElementById('initialQueue').value = '10, 20, 30';
    document.getElementById('newValue').value = '40';
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
    
    // Allow Enter key to start
    document.getElementById('newValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isVisualizing) {
            startVisualization();
        }
    });
});
