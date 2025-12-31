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

// Generate selection sort animation steps
function generateSelectionSortSteps(arr) {
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
        let minIndex = i;
        
        steps.push({
            type: 'select-min',
            i: i,
            minIndex: minIndex,
            array: [...arr],
            comparisons: comparisons,
            swaps: swaps,
            message: `Starting pass ${i + 1}: Finding minimum element from index ${i}`
        });

        for (let j = i + 1; j < n; j++) {
            comparisons++;
            steps.push({
                type: 'compare',
                i: i,
                j: j,
                minIndex: minIndex,
                array: [...arr],
                comparisons: comparisons,
                swaps: swaps,
                message: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIndex}] (${arr[minIndex]})`
            });

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                steps.push({
                    type: 'new-min',
                    i: i,
                    j: j,
                    minIndex: minIndex,
                    array: [...arr],
                    comparisons: comparisons,
                    swaps: swaps,
                    message: `New minimum found: arr[${minIndex}] = ${arr[minIndex]}`
                });
            }
        }

        if (minIndex !== i) {
            const valI = arr[i];
            const valMin = arr[minIndex];
            swaps++;
            steps.push({
                type: 'swap',
                i: i,
                minIndex: minIndex,
                array: [...arr],
                originalValues: { i: valI, min: valMin },
                comparisons: comparisons,
                swaps: swaps,
                message: `Swapping arr[${i}] and arr[${minIndex}]`
            });

            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            
            steps.push({
                type: 'swap-result',
                i: i,
                minIndex: minIndex,
                array: [...arr],
                comparisons: comparisons,
                swaps: swaps,
                message: `Swap complete: arr[${i}] = ${arr[i]}, arr[${minIndex}] = ${arr[minIndex]}`
            });
        }

        steps.push({
            type: 'sorted',
            i: i,
            sortedIndex: i,
            array: [...arr],
            comparisons: comparisons,
            swaps: swaps,
            message: `Element at index ${i} is now in its correct position`
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
        
        if (step.type === 'swap' && step.originalValues) {
            if (index === step.i) {
                box.textContent = step.originalValues.i;
            } else if (index === step.minIndex) {
                box.textContent = step.originalValues.min;
            } else {
                box.textContent = value;
            }
        } else {
            box.textContent = value;
        }

        // Add visual indicators
        if (step.type === 'compare' || step.type === 'new-min') {
            if (index === step.j) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'j';
                element.appendChild(arrow);
            }
            if (index === step.minIndex) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'min';
                    element.appendChild(arrow);
                }
            }
            if (index === step.i) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'i';
                    element.appendChild(arrow);
                }
            }
        } else if (step.type === 'select-min') {
            if (index === step.i) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'i';
                element.appendChild(arrow);
            }
            if (index === step.minIndex) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'min';
                    element.appendChild(arrow);
                }
            }
        }

        if (step.type === 'swap') {
            if (index === step.i || index === step.minIndex) {
                box.classList.add('swapping', 'swap-moving');
            }
        }

        if (step.type === 'swap-result') {
            if (index === step.i || index === step.minIndex) {
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

    // Apply selection sort specific swap animation
    if (step.type === 'swap') {
        requestAnimationFrame(() => {
            const iElement = container.querySelector(`#element-${step.i}`);
            const minElement = container.querySelector(`#element-${step.minIndex}`);
            if (iElement && minElement) {
                // Calculate distance (104px per position: 80px box + 24px gap)
                const distance = Math.abs(step.minIndex - step.i) * 104;
                
                // i moves up then right to min position
                // min moves down then left to i position
                if (step.i < step.minIndex) {
                    // i is to the left, min is to the right
                    iElement.style.setProperty('--swap-distance', `${distance}px`);
                    iElement.classList.add('selection-i-swap');
                    minElement.style.setProperty('--swap-distance', `${distance}px`);
                    minElement.classList.add('selection-min-swap');
                } else {
                    // i is to the right, min is to the left
                    iElement.style.setProperty('--swap-distance', `${distance}px`);
                    iElement.classList.add('selection-i-swap-reverse');
                    minElement.style.setProperty('--swap-distance', `${distance}px`);
                    minElement.classList.add('selection-min-swap-reverse');
                }
            }
        });
    } else if (step.type === 'swap-result') {
        requestAnimationFrame(() => {
            const iElement = container.querySelector(`#element-${step.i}`);
            const minElement = container.querySelector(`#element-${step.minIndex}`);
            if (iElement) {
                iElement.classList.remove('selection-i-swap', 'selection-i-swap-reverse');
                iElement.querySelector('.array-box').classList.remove('swap-moving');
                iElement.style.removeProperty('--swap-distance');
            }
            if (minElement) {
                minElement.classList.remove('selection-min-swap', 'selection-min-swap-reverse');
                minElement.querySelector('.array-box').classList.remove('swap-moving');
                minElement.style.removeProperty('--swap-distance');
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
    
    if (step.type === 'select-min') {
        explanationText = `<p><strong>Current Step:</strong> Starting new pass</p>
                          <p>Finding the minimum element from index ${step.i} onwards.</p>`;
    } else if (step.type === 'compare') {
        explanationText = `<p><strong>Current Step:</strong> Comparing arr[${step.j}] (${step.array[step.j]}) with current minimum arr[${step.minIndex}] (${step.array[step.minIndex]})</p>
                          <p>Looking for the minimum element in the unsorted portion.</p>`;
    } else if (step.type === 'new-min') {
        explanationText = `<p><strong>Current Step:</strong> New minimum found</p>
                          <p>arr[${step.minIndex}] = ${step.array[step.minIndex]} is now the minimum.</p>`;
    } else if (step.type === 'swap') {
        explanationText = `<p><strong>Current Step:</strong> Swapping elements</p>
                          <p>Swapping arr[${step.i}] (${step.originalValues.i}) with minimum arr[${step.minIndex}] (${step.originalValues.min}).</p>
                          <p>Watch i move up then right, and min move down then left!</p>`;
    } else if (step.type === 'swap-result') {
        explanationText = `<p><strong>Swap Complete:</strong></p>
                          <p>Elements have been swapped successfully.</p>
                          <p>arr[${step.i}] = ${step.array[step.i]}, arr[${step.minIndex}] = ${step.array[step.minIndex]}</p>`;
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
        delay = 1500; // Longer for selection sort swap
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
    animationSteps = generateSelectionSortSteps([...array]);
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

