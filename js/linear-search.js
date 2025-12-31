let arraySize = 5;
let array = [];
let target = 25;
let animationSteps = [];
let currentStepIndex = 0;
let isPlaying = false;
let animationInterval = null;
let speed = 5;

// Initialize array inputs
function updateArrayInputs() {
    arraySize = parseInt(document.getElementById('arraySize').value) || 5;
    if (arraySize > 6) arraySize = 6;
    if (arraySize < 2) arraySize = 2;
    document.getElementById('arraySize').value = arraySize;

    const container = document.getElementById('arrayInputs');
    container.innerHTML = '';

    for (let i = 0; i < arraySize; i++) {
        const item = document.createElement('div');
        item.className = 'array-input-item';
        item.innerHTML = `
            <label>Index ${i}:</label>
            <input type="number" id="arr${i}" value="${Math.floor(Math.random() * 50) + 10}">
        `;
        container.appendChild(item);
    }
}

// Get array from inputs
function getArrayFromInputs() {
    const arr = [];
    for (let i = 0; i < arraySize; i++) {
        const value = parseInt(document.getElementById(`arr${i}`).value) || 0;
        arr.push(value);
    }
    return arr;
}

// Generate linear search animation steps
function generateLinearSearchSteps(arr, target) {
    const steps = [];
    let comparisons = 0;

    steps.push({
        type: 'initial',
        array: [...arr],
        target: target,
        comparisons: 0,
        message: `Starting search for target: ${target}`
    });

    for (let i = 0; i < arr.length; i++) {
        comparisons++;
        steps.push({
            type: 'check',
            array: [...arr],
            target: target,
            currentIndex: i,
            comparisons: comparisons,
            message: `Checking arr[${i}] = ${arr[i]}`
        });

        if (arr[i] === target) {
            steps.push({
                type: 'found',
                array: [...arr],
                target: target,
                foundIndex: i,
                comparisons: comparisons,
                message: `Found! Target ${target} is at index ${i}`
            });
            return steps;
        }
    }

    steps.push({
        type: 'not-found',
        array: [...arr],
        target: target,
        comparisons: comparisons,
        message: `Not found! Target ${target} is not in the array`
    });

    return steps;
}

// Render array visualization
function renderArray(step) {
    const container = document.getElementById('arrayVisualization');
    container.innerHTML = '';
    
    // Change container to column layout
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    // Show target value at the top
    const targetDisplay = document.createElement('div');
    targetDisplay.style.cssText = 'text-align: center; margin-bottom: 6.5rem; font-size: 1.2rem; font-weight: bold; color: #667eea; width: 100%;';
    targetDisplay.textContent = `Searching for: ${step.target}`;
    container.appendChild(targetDisplay);

    // Create wrapper for array elements
    const arrayWrapper = document.createElement('div');
    arrayWrapper.style.cssText = 'display: flex; justify-content: center; align-items: flex-end; gap: 1.5rem; width: 100%;';
    container.appendChild(arrayWrapper);

    const arr = step.array;
    
    // Calculate box size based on array length
    // Use container width minus padding, divided by array length
    const containerWidth = container.offsetWidth || 600;
    const gap = 24; // 1.5rem = 24px
    const padding = 40;
    const availableWidth = containerWidth - padding - (gap * (arr.length - 1));
    const boxSize = Math.min(Math.max(availableWidth / arr.length, 50), 120);
    const fontSize = Math.max(0.9, Math.min(1.5, boxSize / 50));

    arr.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.id = `element-${index}`;

        const box = document.createElement('div');
        box.className = 'array-box';
        box.style.width = `${boxSize}px`;
        box.style.height = `${boxSize}px`;
        box.style.fontSize = `${fontSize}rem`;
        box.textContent = value;

        // Visual states
        if (step.type === 'check') {
            if (index === step.currentIndex) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'i';
                element.appendChild(arrow);
            }
            // Mark previously checked elements
            if (index < step.currentIndex) {
                box.classList.add('checked');
            }
        } else if (step.type === 'found') {
            if (index === step.foundIndex) {
                box.classList.add('sorted'); // Use sorted class for found element
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = '✓';
                arrow.style.color = '#38ef7d';
                element.appendChild(arrow);
            } else if (index < step.foundIndex) {
                box.classList.add('checked');
            }
        } else if (step.type === 'not-found') {
            // All elements checked but not found
            box.classList.add('checked');
        }

        const indexLabel = document.createElement('div');
        indexLabel.className = 'array-index';
        indexLabel.textContent = `[${index}]`;

        element.appendChild(box);
        element.appendChild(indexLabel);
        arrayWrapper.appendChild(element);
    });

    updateCodeExplanation(step);

    document.getElementById('currentStep').textContent = step.message;
    document.getElementById('comparisons').textContent = step.comparisons;
    
    if (step.type === 'found') {
        document.getElementById('status').textContent = `Found at index ${step.foundIndex}`;
        document.getElementById('status').style.color = '#38ef7d';
    } else if (step.type === 'not-found') {
        document.getElementById('status').textContent = 'Not Found';
        document.getElementById('status').style.color = '#ff6b6b';
    } else {
        document.getElementById('status').textContent = 'Searching...';
        document.getElementById('status').style.color = '#667eea';
    }
}

// Update code explanation
function updateCodeExplanation(step) {
    const explanation = document.getElementById('codeExplanation');
    let explanationText = '';
    
    if (step.type === 'initial') {
        explanationText = `<p><strong>Starting Linear Search</strong></p>
                          <p>We'll check each element sequentially from left to right.</p>
                          <p>Target: ${step.target}</p>`;
    } else if (step.type === 'check') {
        explanationText = `<p><strong>Current Step:</strong> Checking element at index ${step.currentIndex}</p>
                          <p>Comparing arr[${step.currentIndex}] (${step.array[step.currentIndex]}) with target (${step.target})</p>
                          <p>${step.array[step.currentIndex] === step.target ? 'Match found!' : 'Not a match, moving to next element...'}</p>`;
    } else if (step.type === 'found') {
        explanationText = `<p><strong>Element Found!</strong></p>
                          <p>Target ${step.target} found at index ${step.foundIndex}.</p>
                          <p>Total comparisons: ${step.comparisons}</p>`;
    } else if (step.type === 'not-found') {
        explanationText = `<p><strong>Element Not Found</strong></p>
                          <p>Target ${step.target} is not present in the array.</p>
                          <p>Total comparisons: ${step.comparisons} (checked all ${step.array.length} elements)</p>`;
    } else {
        explanationText = `<p>Ready to start visualization. Click "Start Visualization" to begin!</p>`;
    }
    
    explanation.innerHTML = explanationText;
}

// Play animation
function playAnimation() {
    if (currentStepIndex >= animationSteps.length) {
        pauseAnimation();
        return;
    }

    renderArray(animationSteps[currentStepIndex]);
    
    const currentStep = animationSteps[currentStepIndex];
    const baseDelay = (11 - speed) * 200;
    let delay = baseDelay;
    
    if (currentStep.type === 'found' || currentStep.type === 'not-found') {
        delay = baseDelay + 500; // Pause longer on final result
    }
    
    currentStepIndex++;

    if (isPlaying) {
        animationInterval = setTimeout(playAnimation, delay);
    }
}

// Start visualization
function startVisualization() {
    array = getArrayFromInputs();
    target = parseInt(document.getElementById('targetValue').value) || 0;
    animationSteps = generateLinearSearchSteps([...array], target);
    currentStepIndex = 0;
    isPlaying = false;

    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('stepBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('startBtn').disabled = true;

    if (animationSteps.length > 0) {
        renderArray(animationSteps[0]);
        currentStepIndex = 1;
        updateCodeExplanation(animationSteps[0]);
    }
}

// Pause animation
function pauseAnimation() {
    isPlaying = false;
    if (animationInterval) {
        clearTimeout(animationInterval);
        animationInterval = null;
    }
}

// Step forward
function stepForward() {
    pauseAnimation();
    if (currentStepIndex < animationSteps.length) {
        renderArray(animationSteps[currentStepIndex]);
        currentStepIndex++;
    }
}

// Play animation
function playAnimationAuto() {
    if (currentStepIndex >= animationSteps.length) {
        currentStepIndex = 0;
    }
    isPlaying = true;
    playAnimation();
}

// Reset
function reset() {
    pauseAnimation();
    currentStepIndex = 0;
    animationSteps = [];
    array = [];

    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('stepBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('startBtn').disabled = false;

    document.getElementById('arrayVisualization').innerHTML = '';
    document.getElementById('currentStep').textContent = '-';
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('status').textContent = '-';
    document.getElementById('status').style.color = '#333';
    document.getElementById('codeExplanation').innerHTML = '<p>Click "Start Visualization" to see the algorithm in action!</p>';

    updateArrayInputs();
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    updateArrayInputs();

    document.getElementById('startBtn').addEventListener('click', startVisualization);
    document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
    document.getElementById('stepBtn').addEventListener('click', stepForward);
    document.getElementById('playBtn').addEventListener('click', playAnimationAuto);
    document.getElementById('resetBtn').addEventListener('click', reset);

    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        document.getElementById('speedValue').textContent = speed;
    });
});

window.updateArrayInputs = updateArrayInputs;

