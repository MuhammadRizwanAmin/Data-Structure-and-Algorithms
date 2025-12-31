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
        slot.classList.remove('filled', 'dequeuing', 'highlighted');
        content.textContent = '';
        slot.style.transform = '';
        slot.style.opacity = '';
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
    const frontValue = queue[0];
    
    // Step 1: Check if empty
    steps.push({
        type: 'check',
        message: 'Step 1: Check if queue is empty...',
        queue: [...queue],
        front: front,
        rear: rear
    });
    
    // Step 2: Get front element
    steps.push({
        type: 'getFront',
        message: `Step 2: Get element at front position: ${frontValue}`,
        queue: [...queue],
        front: front,
        rear: rear,
        value: frontValue
    });
    
    // Step 3: Highlight front for removal
    steps.push({
        type: 'highlight',
        message: 'Step 3: Element ready to be removed...',
        queue: [...queue],
        front: front,
        rear: rear,
        value: frontValue
    });
    
    // Step 4: Remove element (move left animation)
    const oldFront = front;
    steps.push({
        type: 'remove',
        message: `Step 4: Remove element ${frontValue} from queue`,
        queue: [...queue],
        front: front,
        rear: rear,
        oldFront: oldFront,
        value: frontValue
    });
    
    // Step 5: Update front pointer after removal
    const newQueue = queue.slice(1);
    const newFront = newQueue.length === 0 ? 0 : (front + 1) % QUEUE_CAPACITY;
    steps.push({
        type: 'updateFront',
        message: 'Step 5: Update front pointer to next element',
        queue: newQueue,
        front: newFront,
        rear: newQueue.length === 0 ? -1 : rear,
        oldFront: oldFront
    });
    
    // Step 6: Complete
    steps.push({
        type: 'complete',
        message: `✓ Element ${frontValue} successfully dequeued!`,
        queue: newQueue,
        front: newFront,
        rear: newQueue.length === 0 ? -1 : rear
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
            
        case 'getFront':
            const frontSlot1 = document.getElementById(`queueSlot${step.front}`);
            frontSlot1.classList.add('highlighted');
            updateQueueDisplay();
            break;
            
        case 'highlight':
            const frontSlot2 = document.getElementById(`queueSlot${step.front}`);
            frontSlot2.classList.remove('highlighted');
            frontSlot2.classList.add('dequeuing');
            updateQueueDisplay();
            break;
            
        case 'remove':
            // Show element moving left (dequeuing animation)
            const frontSlot3 = document.getElementById(`queueSlot${step.oldFront}`);
            if (frontSlot3 && frontSlot3.classList.contains('filled')) {
                frontSlot3.classList.add('dequeuing');
            }
            // Keep current queue state visible for animation
            break;
            
        case 'updateFront':
            // Wait for animation to complete, then update queue and front pointer
            const oldSlot = document.getElementById(`queueSlot${step.oldFront}`);
            if (oldSlot) {
                oldSlot.classList.remove('filled', 'dequeuing');
                oldSlot.querySelector('.slot-content').textContent = '';
            }
            queue = [...step.queue];
            front = step.front;
            rear = step.rear;
            updateQueueDisplay();
            break;
            
        case 'complete':
            updateQueueDisplay();
            break;
    }
    
    currentStepIndex++;
}

function goToPreviousStep() {
    if (!isVisualizing || currentStepIndex <= 0) return;
    
    // Reset to initial state
    const initialStep = animationSteps[0];
    queue = [...initialStep.queue];
    front = initialStep.front;
    rear = initialStep.rear;
    
    // Re-execute all steps up to currentStepIndex - 1
    currentStepIndex = 0;
    const targetIndex = animationSteps.indexOf(animationSteps[currentStepIndex]) - 1;
    
    if (targetIndex < 0) {
        updateQueueDisplay();
        document.getElementById('codeExplanation').innerHTML = '<p>Click "Start Visualization" to see the algorithm in action!</p>';
        return;
    }
    
    // Re-execute steps up to the previous one
    for (let i = 0; i < targetIndex; i++) {
        const step = animationSteps[i];
        executeStepImmediate(step, false);
    }
    currentStepIndex = targetIndex;
    updateQueueDisplay();
}

function executeStepImmediate(step, updateExplanation = true) {
    if (updateExplanation) {
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
    }
    
    switch (step.type) {
        case 'check':
            // Just update display
            break;
        case 'getFront':
            // Highlight handled in updateQueueDisplay
            break;
        case 'highlight':
            // Highlight handled
            break;
        case 'remove':
            queue = [...step.queue];
            front = step.front;
            rear = step.rear;
            break;
        case 'updateFront':
            queue = [...step.queue];
            front = step.front;
            rear = step.rear;
            break;
    }
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
            case 'getFront':
                break;
            case 'highlight':
                break;
            case 'remove':
                queue = [...step.queue];
                front = step.front;
                rear = step.rear;
                break;
            case 'updateFront':
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
        if (step.type === 'getFront') {
            const frontSlot = document.getElementById(`queueSlot${step.front}`);
            if (frontSlot) {
                frontSlot.classList.add('highlighted');
            }
        } else if (step.type === 'highlight') {
            const frontSlot = document.getElementById(`queueSlot${step.front}`);
            if (frontSlot) {
                frontSlot.classList.remove('highlighted');
                frontSlot.classList.add('dequeuing');
            }
        } else if (step.type === 'remove') {
            const oldSlot = document.getElementById(`queueSlot${step.oldFront}`);
            if (oldSlot) {
                oldSlot.classList.add('dequeuing');
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
    
    // Parse initial queue
    if (initialQueueInput) {
        queue = initialQueueInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        if (queue.length > QUEUE_CAPACITY) {
            queue = queue.slice(0, QUEUE_CAPACITY);
        }
    } else {
        queue = [10, 20, 30, 40];
    }
    
    if (queue.length === 0) {
        alert('Queue is empty! Cannot dequeue.');
        return;
    }
    
    front = 0;
    rear = queue.length > 0 ? queue.length - 1 : -1;
    
    initializeQueue();
    updateQueueDisplay();
    
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
    // Stop any ongoing visualization
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    
    isVisualizing = false;
    isPaused = false;
    currentStepIndex = 0;
    animationSteps = [];
    
    // Reset queue to empty
    queue = [];
    front = 0;
    rear = -1;
    
    // Clear and reinitialize
    initializeQueue();
    updateQueueDisplay();
    
    document.getElementById('codeExplanation').innerHTML = 
        '<p>Click "Start Visualization" to see the algorithm in action!</p>';
    document.getElementById('initialQueue').value = '10, 20, 30, 40';
    
    // Reset buttons
    document.getElementById('startBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('stepBtn').disabled = true;
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) prevBtn.disabled = true;
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
