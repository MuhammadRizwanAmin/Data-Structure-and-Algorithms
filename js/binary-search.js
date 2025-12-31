let arraySize = 5;
let array = [];
let target = 25;
let animationSteps = [];
let currentStepIndex = 0;
let isPlaying = false;
let animationInterval = null;
let speed = 5;

// Initialize array inputs with sorted values
function updateArrayInputs() {
    arraySize = parseInt(document.getElementById('arraySize').value) || 5;
    if (arraySize > 6) arraySize = 6;
    if (arraySize < 2) arraySize = 2;
    document.getElementById('arraySize').value = arraySize;

    const container = document.getElementById('arrayInputs');
    container.innerHTML = '';

    // Generate sorted array by default
    const sortedValues = [];
    for (let i = 0; i < arraySize; i++) {
        sortedValues.push(10 + i * 10);
    }

    for (let i = 0; i < arraySize; i++) {
        const item = document.createElement('div');
        item.className = 'array-input-item';
        item.innerHTML = `
            <label>Index ${i}:</label>
            <input type="number" id="arr${i}" value="${sortedValues[i]}" onchange="validateSorted()">
        `;
        container.appendChild(item);
    }
}

// Validate that array is sorted
function validateSorted() {
    const arr = getArrayFromInputs();
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            alert('⚠️ Warning: Array must be sorted in ascending order for Binary Search to work correctly!');
            return false;
        }
    }
    return true;
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

// Generate binary search animation steps
function generateBinarySearchSteps(arr, target) {
    const steps = [];
    let comparisons = 0;
    let left = 0;
    let right = arr.length - 1;

    steps.push({
        type: 'initial',
        array: [...arr],
        target: target,
        left: left,
        right: right,
        comparisons: 0,
        message: `Starting binary search for target: ${target}`
    });

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        comparisons++;

        steps.push({
            type: 'calculate-mid',
            array: [...arr],
            target: target,
            left: left,
            right: right,
            mid: mid,
            comparisons: comparisons,
            message: `Calculating mid = (${left} + ${right}) / 2 = ${mid}`
        });

        steps.push({
            type: 'compare',
            array: [...arr],
            target: target,
            left: left,
            right: right,
            mid: mid,
            comparisons: comparisons,
            message: `Comparing arr[${mid}] (${arr[mid]}) with target (${target})`
        });

        if (arr[mid] === target) {
            steps.push({
                type: 'found',
                array: [...arr],
                target: target,
                foundIndex: mid,
                left: left,
                right: right,
                mid: mid,
                comparisons: comparisons,
                message: `Found! Target ${target} is at index ${mid}`
            });
            return steps;
        }

        if (arr[mid] < target) {
            steps.push({
                type: 'move-right',
                array: [...arr],
                target: target,
                left: left,
                right: right,
                mid: mid,
                comparisons: comparisons,
                message: `arr[${mid}] (${arr[mid]}) < target (${target}), search right half`
            });
            left = mid + 1;
        } else {
            steps.push({
                type: 'move-left',
                array: [...arr],
                target: target,
                left: left,
                right: right,
                mid: mid,
                comparisons: comparisons,
                message: `arr[${mid}] (${arr[mid]}) > target (${target}), search left half`
            });
            right = mid - 1;
        }

        steps.push({
            type: 'update-bounds',
            array: [...arr],
            target: target,
            left: left,
            right: right,
            comparisons: comparisons,
            message: `New search range: left=${left}, right=${right}`
        });
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

    // Show target and search range info at the top
    const infoDisplay = document.createElement('div');
    infoDisplay.style.cssText = 'text-align: center; margin-bottom: 6.5rem; font-size: 1.1rem; width: 100%;';
    
    if (step.type === 'initial' || step.type === 'update-bounds' || step.type === 'calculate-mid' || step.type === 'compare' || step.type === 'move-left' || step.type === 'move-right') {
        infoDisplay.innerHTML = `
            <div style="color: #667eea; font-weight: bold; margin-bottom: 0.5rem;">Searching for: ${step.target}</div>
            <div style="color: #666; font-size: 0.9rem;">
                Search Range: [${step.left}, ${step.right}] | 
                ${step.mid !== undefined ? `Mid: ${step.mid}` : ''}
            </div>
        `;
    } else {
        infoDisplay.innerHTML = `<div style="color: #667eea; font-weight: bold;">Searching for: ${step.target}</div>`;
    }
    
    container.appendChild(infoDisplay);

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

        // Visual states based on step type
        if (step.type === 'initial' || step.type === 'update-bounds') {
            // Show search range
            if (index >= step.left && index <= step.right) {
                box.classList.add('comparing');
            } else {
                box.style.opacity = '0.3';
            }
        } else if (step.type === 'calculate-mid' || step.type === 'compare') {
            // Highlight left, right, and mid
            if (index === step.mid) {
                box.classList.add('swapping'); // Use swapping color for mid
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'mid';
                arrow.style.color = '#4ecdc4';
                element.appendChild(arrow);
            }
            if (index === step.left) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'left';
                    arrow.style.color = '#ff6b6b';
                    element.appendChild(arrow);
                }
            }
            if (index === step.right) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'right';
                    arrow.style.color = '#ff6b6b';
                    element.appendChild(arrow);
                }
            }
            // Dim elements outside search range
            if (index < step.left || index > step.right) {
                box.style.opacity = '0.3';
            }
        } else if (step.type === 'move-left' || step.type === 'move-right') {
            // Show which direction we're moving
            if (index === step.mid) {
                box.classList.add('swapping');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = step.type === 'move-left' ? '← left' : '→ right';
                arrow.style.color = '#4ecdc4';
                element.appendChild(arrow);
            }
            if (index < step.left || index > step.right) {
                box.style.opacity = '0.3';
            }
        } else if (step.type === 'found') {
            if (index === step.foundIndex) {
                box.classList.add('sorted'); // Green for found
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = '✓';
                arrow.style.color = '#38ef7d';
                element.appendChild(arrow);
            } else {
                box.style.opacity = '0.5';
            }
        } else if (step.type === 'not-found') {
            box.style.opacity = '0.5';
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
        explanationText = `<p><strong>Starting Binary Search</strong></p>
                          <p>Initial search range: left = ${step.left}, right = ${step.right}</p>
                          <p>Target: ${step.target}</p>`;
    } else if (step.type === 'calculate-mid') {
        explanationText = `<p><strong>Calculating Midpoint</strong></p>
                          <p>mid = (left + right) / 2 = (${step.left} + ${step.right}) / 2 = ${step.mid}</p>
                          <p>We'll compare arr[${step.mid}] with the target.</p>`;
    } else if (step.type === 'compare') {
        explanationText = `<p><strong>Comparing</strong></p>
                          <p>arr[${step.mid}] = ${step.array[step.mid]}</p>
                          <p>Target = ${step.target}</p>
                          <p>${step.array[step.mid] === step.target ? 'Match found!' : step.array[step.mid] < step.target ? 'arr[mid] < target, search right half' : 'arr[mid] > target, search left half'}</p>`;
    } else if (step.type === 'move-left') {
        explanationText = `<p><strong>Moving Left</strong></p>
                          <p>Since arr[${step.mid}] (${step.array[step.mid]}) > target (${step.target}), we search the left half.</p>
                          <p>New right = mid - 1 = ${step.right}</p>`;
    } else if (step.type === 'move-right') {
        explanationText = `<p><strong>Moving Right</strong></p>
                          <p>Since arr[${step.mid}] (${step.array[step.mid]}) < target (${step.target}), we search the right half.</p>
                          <p>New left = mid + 1 = ${step.left}</p>`;
    } else if (step.type === 'update-bounds') {
        explanationText = `<p><strong>Updated Search Range</strong></p>
                          <p>New search space: [${step.left}, ${step.right}]</p>
                          <p>Search space reduced by half!</p>`;
    } else if (step.type === 'found') {
        explanationText = `<p><strong>Element Found!</strong></p>
                          <p>Target ${step.target} found at index ${step.foundIndex}.</p>
                          <p>Total comparisons: ${step.comparisons}</p>
                          <p>Much faster than linear search!</p>`;
    } else if (step.type === 'not-found') {
        explanationText = `<p><strong>Element Not Found</strong></p>
                          <p>Target ${step.target} is not present in the array.</p>
                          <p>Total comparisons: ${step.comparisons}</p>`;
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
        delay = baseDelay + 800; // Pause longer on final result
    } else if (currentStep.type === 'calculate-mid' || currentStep.type === 'update-bounds') {
        delay = baseDelay + 300; // Slightly longer for important steps
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
    
    // Validate array is sorted
    if (!validateSorted()) {
        return;
    }
    
    animationSteps = generateBinarySearchSteps([...array], target);
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
window.validateSorted = validateSorted;

