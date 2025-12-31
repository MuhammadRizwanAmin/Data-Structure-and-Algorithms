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

// Generate insertion sort animation steps
function generateInsertionSortSteps(arr) {
    const steps = [];
    const n = arr.length;
    let comparisons = 0;
    let shifts = 0;

    steps.push({
        type: 'initial',
        array: [...arr],
        comparisons: 0,
        swaps: 0,
        message: 'Initial array state'
    });

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        steps.push({
            type: 'select-key',
            i: i,
            j: j,
            key: key,
            array: [...arr],
            comparisons: comparisons,
            swaps: shifts,
            message: `Pass ${i}: Selecting key = arr[${i}] = ${key}`
        });

        while (j >= 0 && arr[j] > key) {
            comparisons++;
            steps.push({
                type: 'compare-shift',
                i: i,
                j: j,
                key: key,
                array: [...arr],
                comparisons: comparisons,
                swaps: shifts,
                message: `Comparing key (${key}) with arr[${j}] (${arr[j]})`
            });

            arr[j + 1] = arr[j];
            shifts++;
            steps.push({
                type: 'shift',
                i: i,
                j: j,
                key: key,
                array: [...arr],
                comparisons: comparisons,
                swaps: shifts,
                message: `Shifting arr[${j}] to position ${j + 1}`
            });

            j--;
        }

        if (j + 1 !== i) {
            arr[j + 1] = key;
            steps.push({
                type: 'insert-key',
                i: i,
                j: j + 1,
                key: key,
                array: [...arr],
                comparisons: comparisons,
                swaps: shifts,
                message: `Inserting key (${key}) at position ${j + 1}`
            });
        } else {
            steps.push({
                type: 'key-in-place',
                i: i,
                key: key,
                array: [...arr],
                comparisons: comparisons,
                swaps: shifts,
                message: `Key (${key}) is already in correct position`
            });
        }
    }

    steps.push({
        type: 'complete',
        array: [...arr],
        comparisons: comparisons,
        swaps: shifts,
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
    const containerWidth = container.offsetWidth || 600;
    const gap = 24;
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

        // Visual indicators
        if (step.type === 'select-key') {
            if (index === step.i) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'key';
                element.appendChild(arrow);
            }
        } else if (step.type === 'compare-shift') {
            if (index === step.i) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'key';
                element.appendChild(arrow);
            }
            if (index === step.j) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'j';
                    element.appendChild(arrow);
                }
            }
        } else if (step.type === 'shift') {
            // Highlight the element being shifted
            if (index === step.j) {
                box.classList.add('swapping');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'shift';
                element.appendChild(arrow);
            }
            // Show key position
            if (index === step.i) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'key';
                    element.appendChild(arrow);
                }
            }
        } else if (step.type === 'insert-key') {
            if (index === step.j) {
                box.classList.add('swapping');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'insert';
                element.appendChild(arrow);
            }
        } else if (step.type === 'key-in-place') {
            if (index === step.i) {
                box.classList.add('sorted');
            }
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

    // Apply shift animations
    if (step.type === 'shift') {
        requestAnimationFrame(() => {
            const shiftElement = container.querySelector(`#element-${step.j}`);
            if (shiftElement) {
                shiftElement.classList.add('shift-right');
            }
        });
    } else if (step.type === 'insert-key') {
        requestAnimationFrame(() => {
            const insertElement = container.querySelector(`#element-${step.j}`);
            if (insertElement) {
                insertElement.classList.add('insert-key');
            }
        });
    }

    updateCodeExplanation(step);

    document.getElementById('currentStep').textContent = step.message;
    document.getElementById('comparisons').textContent = step.comparisons;
    document.getElementById('swaps').textContent = step.swaps;
}

// Update code explanation
function updateCodeExplanation(step) {
    const explanation = document.getElementById('codeExplanation');
    let explanationText = '';
    
    if (step.type === 'select-key') {
        explanationText = `<p><strong>Current Step:</strong> Selecting key element</p>
                          <p>Key = arr[${step.i}] = ${step.key}. We'll insert it in the correct position in the sorted portion.</p>`;
    } else if (step.type === 'compare-shift') {
        explanationText = `<p><strong>Current Step:</strong> Comparing key with arr[${step.j}]</p>
                          <p>Since arr[${step.j}] (${step.array[step.j]}) > key (${step.key}), we need to shift arr[${step.j}] to the right.</p>`;
    } else if (step.type === 'shift') {
        explanationText = `<p><strong>Current Step:</strong> Shifting element</p>
                          <p>Moving arr[${step.j}] (${step.array[step.j]}) to position ${step.j + 1} to make room for the key.</p>`;
    } else if (step.type === 'insert-key') {
        explanationText = `<p><strong>Current Step:</strong> Inserting key</p>
                          <p>Inserting key (${step.key}) at position ${step.j}.</p>`;
    } else if (step.type === 'key-in-place') {
        explanationText = `<p><strong>Current Step:</strong> Key in place</p>
                          <p>The key (${step.key}) is already in its correct position.</p>`;
    } else if (step.type === 'complete') {
        explanationText = `<p><strong>Algorithm Complete!</strong></p>
                          <p>The array is now fully sorted in ascending order.</p>
                          <p>Total comparisons: ${step.comparisons}, Total shifts: ${step.swaps}</p>`;
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
    
    if (currentStep.type === 'shift') {
        delay = 900; // Wait for shift animation
    } else if (currentStep.type === 'insert-key') {
        delay = 700; // Wait for insert animation
    }
    
    currentStepIndex++;

    if (isPlaying) {
        animationInterval = setTimeout(playAnimation, delay);
    }
}

// Start visualization
function startVisualization() {
    array = getArrayFromInputs();
    animationSteps = generateInsertionSortSteps([...array]);
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

