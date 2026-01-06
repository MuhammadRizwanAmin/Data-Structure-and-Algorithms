// BST Node class
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

let root = null;
let isVisualizing = false;
let isPaused = false;
let animationSteps = [];
let currentStepIndex = 0;
let speed = 5;
let animationTimeout = null;

// Build tree from array
function buildTree(values) {
    root = null;
    for (const val of values) {
        root = insertHelper(root, val);
    }
    return root;
}

// Helper function for insertion
function insertHelper(node, value) {
    if (!node) {
        return new TreeNode(value);
    }
    
    if (value < node.value) {
        node.left = insertHelper(node.left, value);
    } else if (value > node.value) {
        node.right = insertHelper(node.right, value);
    }
    
    return node;
}

// Find insertion path
function findInsertionPath(value) {
    const path = [];
    let current = root;
    
    while (current) {
        path.push({
            node: current,
            direction: value < current.value ? 'left' : 'right'
        });
        
        if (value < current.value) {
            if (!current.left) break;
            current = current.left;
        } else if (value > current.value) {
            if (!current.right) break;
            current = current.right;
        } else {
            // Value already exists
            return null;
        }
    }
    
    return path;
}

// Calculate node positions for tree visualization
function calculatePositions(node, level, x, minX) {
    if (!node) return minX;
    
    const nodeWidth = 80;
    const nodeHeight = 60;
    const horizontalSpacing = 100;
    const verticalSpacing = 100;
    
    const leftX = calculatePositions(node.left, level + 1, x, minX);
    node.x = leftX + nodeWidth / 2;
    node.y = level * verticalSpacing + nodeHeight / 2;
    const rightX = calculatePositions(node.right, level + 1, leftX + nodeWidth + horizontalSpacing, leftX + nodeWidth);
    
    return Math.max(rightX, leftX + nodeWidth);
}

// Render the BST
function renderTree() {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';
    
    if (!root) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Tree is empty. Insert a value to start!</p>';
        return;
    }
    
    calculatePositions(root, 0, 0, 0);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '600');
    svg.style.overflow = 'visible';
    
    drawEdges(svg, root);
    drawNodes(svg, root);
    
    container.appendChild(svg);
}

// Draw edges
function drawEdges(svg, node) {
    if (!node) return;
    
    const nodeWidth = 80;
    const nodeHeight = 60;
    
    if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y + nodeHeight / 2);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y - nodeHeight / 2);
        line.setAttribute('stroke', '#667eea');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        drawEdges(svg, node.left);
    }
    
    if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y + nodeHeight / 2);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y - nodeHeight / 2);
        line.setAttribute('stroke', '#667eea');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        drawEdges(svg, node.right);
    }
}

// Draw nodes
function drawNodes(svg, node) {
    if (!node) return;
    
    const nodeWidth = 80;
    const nodeHeight = 60;
    
    drawNodes(svg, node.left);
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `bst-node node-${node.value}`);
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', node.x - nodeWidth / 2);
    rect.setAttribute('y', node.y - nodeHeight / 2);
    rect.setAttribute('width', nodeWidth);
    rect.setAttribute('height', nodeHeight);
    rect.setAttribute('rx', '8');
    rect.setAttribute('fill', '#667eea');
    rect.setAttribute('stroke', '#764ba2');
    rect.setAttribute('stroke-width', '2');
    group.appendChild(rect);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '18');
    text.setAttribute('font-weight', 'bold');
    text.textContent = node.value;
    group.appendChild(text);
    
    svg.appendChild(group);
    
    drawNodes(svg, node.right);
}

// Highlight node
function highlightNode(value, highlight) {
    const nodeElement = document.querySelector(`.node-${value}`);
    if (nodeElement) {
        const rect = nodeElement.querySelector('rect');
        if (rect) {
            if (highlight) {
                rect.setAttribute('fill', '#fbbf24');
                rect.setAttribute('stroke', '#f59e0b');
            } else {
                rect.setAttribute('fill', '#667eea');
                rect.setAttribute('stroke', '#764ba2');
            }
        }
    }
}

// Clear all highlights
function clearHighlights() {
    const nodes = document.querySelectorAll('.bst-node rect');
    nodes.forEach(rect => {
        rect.setAttribute('fill', '#667eea');
        rect.setAttribute('stroke', '#764ba2');
    });
}

function getSpeedDelay() {
    return 1100 - (speed * 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateAnimationSteps(newValue) {
    const steps = [];
    const path = findInsertionPath(newValue);
    
    if (!path) {
        steps.push({
            type: 'error',
            message: `Value ${newValue} already exists in the tree!`
        });
        return steps;
    }
    
    // Step 1: Start at root
    steps.push({
        type: 'start',
        message: `Step 1: Start at root (${root.value})`,
        currentNode: root.value
    });
    
    // Steps for traversing the path
    for (let i = 0; i < path.length; i++) {
        const step = path[i];
        const nextNode = step.direction === 'left' ? step.node.left : step.node.right;
        
        steps.push({
            type: 'compare',
            message: `Step ${i + 2}: Compare ${newValue} with ${step.node.value}. ${newValue} ${newValue < step.node.value ? '<' : '>'} ${step.node.value}, go ${step.direction}`,
            currentNode: step.node.value,
            direction: step.direction,
            newValue: newValue
        });
        
        if (nextNode) {
            steps.push({
                type: 'move',
                message: `Step ${i + 3}: Move to ${step.direction} child (${nextNode.value})`,
                currentNode: nextNode.value
            });
        }
    }
    
    // Final step: Insert
    const lastStep = path[path.length - 1];
    steps.push({
        type: 'insert',
        message: `Step ${steps.length + 1}: Insert ${newValue} as ${lastStep.direction} child of ${lastStep.node.value}`,
        parentNode: lastStep.node.value,
        direction: lastStep.direction,
        newValue: newValue
    });
    
    // Complete
    steps.push({
        type: 'complete',
        message: `✓ Node ${newValue} successfully inserted!`,
        newValue: newValue
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
    
    clearHighlights();
    
    switch (step.type) {
        case 'start':
            highlightNode(step.currentNode, true);
            break;
            
        case 'compare':
            highlightNode(step.currentNode, true);
            break;
            
        case 'move':
            highlightNode(step.currentNode, true);
            break;
            
        case 'insert':
            // Insert the node
            root = insertHelper(root, step.newValue);
            renderTree();
            // Wait a bit for render
            await sleep(100);
            // Highlight the new node
            highlightNode(step.newValue, true);
            const newNodeElement = document.querySelector(`.node-${step.newValue}`);
            if (newNodeElement) {
                const rect = newNodeElement.querySelector('rect');
                if (rect) {
                    rect.setAttribute('fill', '#4ade80');
                    rect.setAttribute('stroke', '#22c55e');
                }
            }
            break;
            
        case 'complete':
            clearHighlights();
            highlightNode(step.newValue, true);
            const completeNode = document.querySelector(`.node-${step.newValue}`);
            if (completeNode) {
                const rect = completeNode.querySelector('rect');
                if (rect) {
                    rect.setAttribute('fill', '#4ade80');
                    rect.setAttribute('stroke', '#22c55e');
                }
            }
            break;
            
        case 'error':
            alert(step.message);
            stopVisualization();
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
    
    // Rebuild tree to initial state
    const initialTreeInput = document.getElementById('initialTree').value.trim();
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
    } else {
        root = null;
    }
    
    // Re-execute steps up to currentStepIndex
    const newValue = parseInt(document.getElementById('newValue').value);
    animationSteps = generateAnimationSteps(newValue);
    
    for (let i = 0; i < currentStepIndex; i++) {
        const step = animationSteps[i];
        if (step.type === 'insert') {
            root = insertHelper(root, step.newValue);
        }
    }
    
    renderTree();
    
    if (currentStepIndex < animationSteps.length) {
        const step = animationSteps[currentStepIndex];
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
        clearHighlights();
        if (step.currentNode) {
            highlightNode(step.currentNode, true);
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
    
    clearHighlights();
}

function startVisualization() {
    if (isVisualizing) return;
    
    const initialTreeInput = document.getElementById('initialTree').value.trim();
    const newValue = parseInt(document.getElementById('newValue').value);
    
    if (isNaN(newValue)) {
        alert('Please enter a valid number to insert!');
        return;
    }
    
    // Build initial tree
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
    } else {
        root = null;
    }
    
    // Check if value already exists
    if (root && findInsertionPath(newValue) === null) {
        alert(`Value ${newValue} already exists in the tree!`);
        return;
    }
    
    renderTree();
    
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
    
    const initialTreeInput = document.getElementById('initialTree').value.trim();
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
    } else {
        root = null;
    }
    
    renderTree();
    document.getElementById('codeExplanation').innerHTML = 
        '<p>Click "Start Visualization" to see the algorithm in action!</p>';
    document.getElementById('initialTree').value = '50, 30, 70, 20, 40, 60, 80';
    document.getElementById('newValue').value = '35';
    clearHighlights();
}

window.addEventListener('DOMContentLoaded', () => {
    reset();
    
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
    
    document.getElementById('newValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isVisualizing) {
            startVisualization();
        }
    });
});
