let arraySize = 5;
let array = [];
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
            <input type="number" id="arr${i}" value="${Math.floor(Math.random() * 100)}">
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

// Generate bubble sort animation steps
function generateBubbleSortSteps(arr) {
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    steps.push({
        type: 'initial',
        array: [...arr],
        comparisons: 0,
        swaps: 0,
        message: 'Initial array state'
    });

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            steps.push({
                type: 'compare',
                i: i,
                j: j,
                array: [...arr],
                comparisons: comparisons,
                swaps: swaps,
                message: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]})`
            });

            if (arr[j] > arr[j + 1]) {
                const valJ = arr[j];
                const valJ1 = arr[j + 1];
                
                swaps++;
                steps.push({
                    type: 'swap',
                    i: i,
                    j: j,
                    array: [...arr],
                    originalValues: { j: valJ, j1: valJ1 },
                    comparisons: comparisons,
                    swaps: swaps,
                    message: `Swapping arr[${j}] and arr[${j + 1}]`
                });
                
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                
                steps.push({
                    type: 'swap-result',
                    i: i,
                    j: j,
                    array: [...arr],
                    comparisons: comparisons,
                    swaps: swaps,
                    message: `Swap complete: arr[${j}] = ${arr[j]}, arr[${j + 1}] = ${arr[j + 1]}`
                });
            }
        }
        
        steps.push({
            type: 'sorted',
            i: i,
            sortedIndex: n - i - 1,
            array: [...arr],
            comparisons: comparisons,
            swaps: swaps,
            message: `Element at index ${n - i - 1} is now in its correct position`
        });
    }

    steps.push({
        type: 'complete',
        array: [...arr],
        comparisons: comparisons,
        swaps: swaps,
        message: 'Array is now sorted!'
    });

    return steps;
}

// Render array visualization
function renderArray(step) {
    const container = document.getElementById('arrayVisualization');
    container.innerHTML = '';

    const arr = step.array;
    
    // Calculate box size based on array length
    // For 2-6 elements, adjust size dynamically
    const containerWidth = container.offsetWidth || 600; // Fallback width
    const gap = 24; // Gap between boxes
    const padding = 40; // Container padding
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
        
        if (step.type === 'swap' && step.originalValues) {
            if (index === step.j) {
                box.textContent = step.originalValues.j;
            } else if (index === step.j + 1) {
                box.textContent = step.originalValues.j1;
            } else {
                box.textContent = value;
            }
        } else {
            box.textContent = value;
        }

        if (step.type === 'compare' || step.type === 'swap') {
            if (index === step.j) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'j';
                element.appendChild(arrow);
            }
            if (index === step.j + 1) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'j+1';
                    element.appendChild(arrow);
                }
            }
        }

        if (step.type === 'swap') {
            if (index === step.j || index === step.j + 1) {
                box.classList.add('swapping', 'swap-moving');
            }
        }

        if (step.type === 'swap-result') {
            if (index === step.j || index === step.j + 1) {
                box.classList.add('swapping');
            }
        }

        if (step.type === 'sorted' && index === step.sortedIndex) {
            box.classList.add('sorted');
        }

        if (step.type === 'complete') {
            box.classList.add('sorted');
        }

        const indexLabel = document.createElement('div');
        indexLabel.className = 'array-index';
        indexLabel.textContent = `[${index}]`;

        element.appendChild(box);
        element.appendChild(indexLabel);
        container.appendChild(element);
    });

    // Apply swap animations
    if (step.type === 'swap') {
        requestAnimationFrame(() => {
            const leftElement = container.querySelector(`#element-${step.j}`);
            const rightElement = container.querySelector(`#element-${step.j + 1}`);
            if (leftElement) leftElement.classList.add('swap-left');
            if (rightElement) rightElement.classList.add('swap-right');
        });
    } else if (step.type === 'swap-result') {
        requestAnimationFrame(() => {
            const leftElement = container.querySelector(`#element-${step.j}`);
            const rightElement = container.querySelector(`#element-${step.j + 1}`);
            if (leftElement) {
                leftElement.classList.remove('swap-left');
                leftElement.querySelector('.array-box').classList.remove('swap-moving');
            }
            if (rightElement) {
                rightElement.classList.remove('swap-right');
                rightElement.querySelector('.array-box').classList.remove('swap-moving');
            }
        });
    }

    // Update code explanation
    updateCodeExplanation(step);

    // Update info
    document.getElementById('currentStep').textContent = step.message;
    document.getElementById('comparisons').textContent = step.comparisons;
    document.getElementById('swaps').textContent = step.swaps;
}

// Update code explanation
function updateCodeExplanation(step) {
    const explanation = document.getElementById('codeExplanation');
    let explanationText = '';
    
    if (step.type === 'compare') {
        explanationText = `<p><strong>Current Step:</strong> Comparing elements at indices ${step.j} and ${step.j + 1}</p>
                          <p>Checking if arr[${step.j}] (${step.array[step.j]}) > arr[${step.j + 1}] (${step.array[step.j + 1]})</p>`;
    } else if (step.type === 'swap') {
        explanationText = `<p><strong>Current Step:</strong> Swapping elements</p>
                          <p>Since arr[${step.j}] (${step.originalValues.j}) > arr[${step.j + 1}] (${step.originalValues.j1}), we swap them.</p>
                          <p>Watch the boxes move to their new positions!</p>`;
    } else if (step.type === 'swap-result') {
        explanationText = `<p><strong>Swap Complete:</strong></p>
                          <p>Elements have been swapped successfully.</p>
                          <p>arr[${step.j}] = ${step.array[step.j]}, arr[${step.j + 1}] = ${step.array[step.j + 1]}</p>`;
    } else if (step.type === 'sorted') {
        explanationText = `<p><strong>Current Step:</strong> Element sorted</p>
                          <p>The element at index ${step.sortedIndex} is now in its correct final position.</p>`;
    } else if (step.type === 'complete') {
        explanationText = `<p><strong>Algorithm Complete!</strong></p>
                          <p>The array is now fully sorted in ascending order.</p>
                          <p>Total comparisons: ${step.comparisons}, Total swaps: ${step.swaps}</p>`;
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
    
    if (currentStep.type === 'swap') {
        delay = 1300;
    } else if (currentStep.type === 'swap-result') {
        delay = baseDelay + 200;
    }
    
    currentStepIndex++;

    if (isPlaying) {
        animationInterval = setTimeout(playAnimation, delay);
    }
}

// Start visualization
function startVisualization() {
    array = getArrayFromInputs();
    animationSteps = generateBubbleSortSteps([...array]);
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
    document.getElementById('swaps').textContent = '0';
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

