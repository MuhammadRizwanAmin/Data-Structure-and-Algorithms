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

    // Initial state
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
                // Store original values for swap animation
                const valJ = arr[j];
                const valJ1 = arr[j + 1];
                
                // Add swap animation step (showing original values moving)
                swaps++;
                steps.push({
                    type: 'swap',
                    i: i,
                    j: j,
                    array: [...arr], // Keep original array for this step
                    originalValues: { j: valJ, j1: valJ1 }, // Original values for display
                    comparisons: comparisons,
                    swaps: swaps,
                    message: `Swapping arr[${j}] and arr[${j + 1}]`
                });
                
                // Actually swap the array
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                
                // Add result step showing swapped values
                steps.push({
                    type: 'swap-result',
                    i: i,
                    j: j,
                    array: [...arr], // Swapped values
                    comparisons: comparisons,
                    swaps: swaps,
                    message: `Swap complete: arr[${j}] = ${arr[j]}, arr[${j + 1}] = ${arr[j + 1]}`
                });
            }
        }
        
        // Mark sorted element
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

    // Mark all as sorted
    steps.push({
        type: 'complete',
        array: [...arr],
        comparisons: comparisons,
        swaps: swaps,
        message: 'Array is now sorted!'
    });

    return steps;
}

// Store element positions for swap animation
let elementPositions = {};

// Render array visualization
function renderArray(step) {
    const container = document.getElementById('arrayVisualization');
    
    // Store current positions before clearing
    if (container.children.length > 0) {
        container.querySelectorAll('.array-element').forEach((el, idx) => {
            const rect = el.getBoundingClientRect();
            elementPositions[idx] = {
                left: rect.left,
                top: rect.top
            };
        });
    }

    container.innerHTML = '';

    const arr = step.array;

    arr.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.id = `element-${index}`;

        const box = document.createElement('div');
        box.className = 'array-box';
        
        // For swap steps, show original values during animation
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

        // Add classes based on state
        if (step.type === 'compare' || step.type === 'swap') {
            if (currentAlgorithm === 'bubble-sort') {
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
            } else if (currentAlgorithm === 'selection-sort') {
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
            }
        } else if (step.type === 'select-min' || step.type === 'new-min') {
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
        } else if (step.type === 'select-key' || step.type === 'compare-shift' || step.type === 'shift' || step.type === 'insert-key' || step.type === 'key-in-place') {
            if (index === step.i) {
                box.classList.add('comparing');
                const arrow = document.createElement('div');
                arrow.className = 'arrow j-arrow';
                arrow.textContent = 'key';
                element.appendChild(arrow);
            }
            if (step.j !== undefined && index === step.j) {
                box.classList.add('comparing');
                if (!element.querySelector('.j-arrow')) {
                    const arrow = document.createElement('div');
                    arrow.className = 'arrow j-arrow';
                    arrow.textContent = 'j';
                    element.appendChild(arrow);
                }
            }
        }

        // Handle swap animation - need to trigger after DOM insertion
        // Handle swap animation
        if (step.type === 'swap') {
            if (currentAlgorithm === 'bubble-sort') {
                if (index === step.j) {
                    box.classList.add('swapping', 'swap-moving');
                }
                if (index === step.j + 1) {
                    box.classList.add('swapping', 'swap-moving');
                }
            } else if (currentAlgorithm === 'selection-sort') {
                if (index === step.i) {
                    box.classList.add('swapping', 'swap-moving');
                }
                if (index === step.minIndex) {
                    box.classList.add('swapping', 'swap-moving');
                }
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

    // Apply swap animations after DOM is ready
    if (step.type === 'swap') {
        requestAnimationFrame(() => {
            if (currentAlgorithm === 'bubble-sort') {
                const leftElement = container.querySelector(`#element-${step.j}`);
                const rightElement = container.querySelector(`#element-${step.j + 1}`);
                if (leftElement) leftElement.classList.add('swap-left');
                if (rightElement) rightElement.classList.add('swap-right');
            } else if (currentAlgorithm === 'selection-sort') {
                const iElement = container.querySelector(`#element-${step.i}`);
                const minElement = container.querySelector(`#element-${step.minIndex}`);
                if (iElement && minElement) {
                    // For selection sort, use the same swap animation
                    // The animation will work for any distance
                    if (step.i < step.minIndex) {
                        iElement.classList.add('swap-left');
                        minElement.classList.add('swap-right');
                    } else {
                        iElement.classList.add('swap-right');
                        minElement.classList.add('swap-left');
                    }
                }
            }
        });
    } else if (step.type === 'swap-result') {
        // Remove swap animation classes and show final state
        requestAnimationFrame(() => {
            if (currentAlgorithm === 'bubble-sort') {
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
            } else if (currentAlgorithm === 'selection-sort') {
                const iElement = container.querySelector(`#element-${step.i}`);
                const minElement = container.querySelector(`#element-${step.minIndex}`);
                if (iElement) {
                    iElement.classList.remove('swap-left', 'swap-right');
                    iElement.querySelector('.array-box').classList.remove('swap-moving');
                }
                if (minElement) {
                    minElement.classList.remove('swap-left', 'swap-right');
                    minElement.querySelector('.array-box').classList.remove('swap-moving');
                }
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
        if (currentAlgorithm === 'bubble-sort') {
            explanationText = `<p><strong>Current Step:</strong> Comparing elements at indices ${step.j} and ${step.j + 1}</p>
                              <p>Checking if arr[${step.j}] (${step.array[step.j]}) > arr[${step.j + 1}] (${step.array[step.j + 1]})</p>`;
        } else if (currentAlgorithm === 'selection-sort') {
            explanationText = `<p><strong>Current Step:</strong> Comparing arr[${step.j}] (${step.array[step.j]}) with current minimum arr[${step.minIndex}] (${step.array[step.minIndex]})</p>
                              <p>Looking for the minimum element in the unsorted portion.</p>`;
        }
    } else if (step.type === 'select-min') {
        explanationText = `<p><strong>Current Step:</strong> Starting new pass</p>
                          <p>Finding the minimum element from index ${step.i} onwards.</p>`;
    } else if (step.type === 'new-min') {
        explanationText = `<p><strong>Current Step:</strong> New minimum found</p>
                          <p>arr[${step.minIndex}] = ${step.array[step.minIndex]} is now the minimum.</p>`;
    } else if (step.type === 'select-key') {
        explanationText = `<p><strong>Current Step:</strong> Selecting key element</p>
                          <p>Key = arr[${step.i}] = ${step.key}. We'll insert it in the correct position.</p>`;
    } else if (step.type === 'compare-shift') {
        explanationText = `<p><strong>Current Step:</strong> Comparing key with arr[${step.j}]</p>
                          <p>Since arr[${step.j}] (${step.array[step.j]}) > key (${step.key}), we need to shift.</p>`;
    } else if (step.type === 'shift') {
        explanationText = `<p><strong>Current Step:</strong> Shifting element</p>
                          <p>Moving arr[${step.j}] to position ${step.j + 1} to make room for the key.</p>`;
    } else if (step.type === 'insert-key') {
        explanationText = `<p><strong>Current Step:</strong> Inserting key</p>
                          <p>Inserting key (${step.key}) at position ${step.j}.</p>`;
    } else if (step.type === 'key-in-place') {
        explanationText = `<p><strong>Current Step:</strong> Key in place</p>
                          <p>The key (${step.key}) is already in its correct position.</p>`;
    } else if (step.type === 'swap') {
        if (currentAlgorithm === 'bubble-sort') {
            explanationText = `<p><strong>Current Step:</strong> Swapping elements</p>
                              <p>Since arr[${step.j}] (${step.originalValues.j}) > arr[${step.j + 1}] (${step.originalValues.j1}), we swap them.</p>
                              <p>Watch the boxes move to their new positions!</p>`;
        } else if (currentAlgorithm === 'selection-sort') {
            explanationText = `<p><strong>Current Step:</strong> Swapping elements</p>
                              <p>Swapping arr[${step.i}] (${step.originalValues.i}) with minimum arr[${step.minIndex}] (${step.originalValues.min}).</p>
                              <p>Watch the boxes move to their new positions!</p>`;
        }
    } else if (step.type === 'swap-result') {
        if (currentAlgorithm === 'bubble-sort') {
            explanationText = `<p><strong>Swap Complete:</strong></p>
                              <p>Elements have been swapped successfully.</p>
                              <p>arr[${step.j}] = ${step.array[step.j]}, arr[${step.j + 1}] = ${step.array[step.j + 1]}</p>`;
        } else if (currentAlgorithm === 'selection-sort') {
            explanationText = `<p><strong>Swap Complete:</strong></p>
                              <p>Elements have been swapped successfully.</p>
                              <p>arr[${step.i}] = ${step.array[step.i]}, arr[${step.minIndex}] = ${step.array[step.minIndex]}</p>`;
        }
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
    
    // For swap steps, wait longer to see the animation (1.2s animation + buffer)
    const currentStep = animationSteps[currentStepIndex];
    const baseDelay = (11 - speed) * 200; // Speed: 1 = slow (2000ms), 10 = fast (200ms)
    let delay = baseDelay;
    
    if (currentStep.type === 'swap') {
        delay = 1300; // Wait for 1.2s animation + 100ms buffer
    } else if (currentStep.type === 'swap-result') {
        delay = baseDelay + 200; // Small delay to show result
    }
    
    currentStepIndex++;

    if (isPlaying) {
        animationInterval = setTimeout(playAnimation, delay);
    }
}

let currentAlgorithm = 'bubble-sort';

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

// Start visualization
function startVisualization() {
    array = getArrayFromInputs();
    
    // Get algorithm from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentAlgorithm = urlParams.get('alg') || 'bubble-sort';
    
    // Generate steps based on algorithm
    if (currentAlgorithm === 'bubble-sort') {
        animationSteps = generateBubbleSortSteps([...array]);
        updateAlgorithmCode('bubble-sort');
    } else if (currentAlgorithm === 'selection-sort') {
        animationSteps = generateSelectionSortSteps([...array]);
        updateAlgorithmCode('selection-sort');
    } else if (currentAlgorithm === 'insertion-sort') {
        animationSteps = generateInsertionSortSteps([...array]);
        updateAlgorithmCode('insertion-sort');
    } else {
        animationSteps = generateBubbleSortSteps([...array]);
        updateAlgorithmCode('bubble-sort');
    }
    
    currentStepIndex = 0;
    isPlaying = false;

    // Enable controls
    document.getElementById('pauseBtn').disabled = false;
    document.getElementById('stepBtn').disabled = false;
    document.getElementById('playBtn').disabled = false;
    document.getElementById('startBtn').disabled = true;

    // Render first step
    if (animationSteps.length > 0) {
        renderArray(animationSteps[0]);
        currentStepIndex = 1;
        updateCodeExplanation(animationSteps[0]);
    }
}

// Update algorithm code display
function updateAlgorithmCode(algorithmId) {
    const codeElement = document.getElementById('algorithmCode');
    const algorithms = {
        'bubble-sort': `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
        'selection-sort': `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        // Swap arr[i] and arr[minIndex]
        int temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
}`,
        'insertion-sort': `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
    };
    
    if (algorithms[algorithmId]) {
        codeElement.textContent = algorithms[algorithmId];
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

    // Disable controls
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('stepBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('startBtn').disabled = false;

    // Clear visualization
    document.getElementById('arrayVisualization').innerHTML = '';
    document.getElementById('currentStep').textContent = '-';
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('codeExplanation').innerHTML = '<p>Click "Start Visualization" to see the algorithm in action!</p>';

    // Reset inputs
    updateArrayInputs();
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Check algorithm type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmId = urlParams.get('alg');

    currentAlgorithm = algorithmId || 'bubble-sort';
    
    if (algorithmId === 'bubble-sort') {
        document.getElementById('algorithmName').textContent = 'Bubble Sort Visualization';
        updateAlgorithmCode('bubble-sort');
    } else if (algorithmId === 'selection-sort') {
        document.getElementById('algorithmName').textContent = 'Selection Sort Visualization';
        updateAlgorithmCode('selection-sort');
    } else if (algorithmId === 'insertion-sort') {
        document.getElementById('algorithmName').textContent = 'Insertion Sort Visualization';
        updateAlgorithmCode('insertion-sort');
    } else {
        document.getElementById('algorithmName').textContent = 'Algorithm Visualization';
        updateAlgorithmCode('bubble-sort');
    }

    updateArrayInputs();

    // Event listeners
    document.getElementById('startBtn').addEventListener('click', startVisualization);
    document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
    document.getElementById('stepBtn').addEventListener('click', stepForward);
    document.getElementById('playBtn').addEventListener('click', playAnimationAuto);
    document.getElementById('resetBtn').addEventListener('click', reset);

    // Speed control
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        document.getElementById('speedValue').textContent = speed;
    });
});

// Make updateArrayInputs available globally
window.updateArrayInputs = updateArrayInputs;

