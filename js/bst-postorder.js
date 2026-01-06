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
let traversalOrder = [];

function buildTree(values) {
    root = null;
    for (const val of values) {
        root = insertHelper(root, val);
    }
    return root;
}

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

function postorderTraversal(node, steps, path = []) {
    if (!node) return steps;
    
    steps.push({
        type: 'visit',
        message: `Visit left subtree of ${node.value}`,
        currentNode: node.value,
        action: 'left'
    });
    
    const leftSteps = postorderTraversal(node.left, [], [...path, node]);
    steps.push(...leftSteps);
    
    steps.push({
        type: 'visit',
        message: `Visit right subtree of ${node.value}`,
        currentNode: node.value,
        action: 'right'
    });
    
    const rightSteps = postorderTraversal(node.right, [], [...path, node]);
    steps.push(...rightSteps);
    
    steps.push({
        type: 'process',
        message: `Process node ${node.value} (add to result)`,
        currentNode: node.value,
        action: 'process'
    });
    
    return steps;
}

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

function renderTree() {
    const container = document.getElementById('treeContainer');
    container.innerHTML = '';
    
    if (!root) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Tree is empty!</p>';
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

function highlightNode(value, highlight, color = '#fbbf24') {
    const nodeElement = document.querySelector(`.node-${value}`);
    if (nodeElement) {
        const rect = nodeElement.querySelector('rect');
        if (rect) {
            if (highlight) {
                rect.setAttribute('fill', color);
                rect.setAttribute('stroke', color === '#4ade80' ? '#22c55e' : '#f59e0b');
            } else {
                rect.setAttribute('fill', '#667eea');
                rect.setAttribute('stroke', '#764ba2');
            }
        }
    }
}

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

function generateAnimationSteps() {
    traversalOrder = [];
    return postorderTraversal(root, []);
}

async function executeStep() {
    if (currentStepIndex >= animationSteps.length) {
        stopVisualization();
        return;
    }
    
    const step = animationSteps[currentStepIndex];
    document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
    
    if (step.type === 'process') {
        clearHighlights();
        highlightNode(step.currentNode, true, '#4ade80');
        traversalOrder.push(step.currentNode);
        document.getElementById('traversalOrder').textContent = traversalOrder.join(' → ');
    } else if (step.type === 'visit') {
        clearHighlights();
        highlightNode(step.currentNode, true);
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
    
    traversalOrder = [];
    for (let i = 0; i < currentStepIndex; i++) {
        const step = animationSteps[i];
        if (step.type === 'process') {
            traversalOrder.push(step.currentNode);
        }
    }
    document.getElementById('traversalOrder').textContent = traversalOrder.join(' → ') || 'None';
    
    if (currentStepIndex < animationSteps.length) {
        const step = animationSteps[currentStepIndex];
        document.getElementById('codeExplanation').innerHTML = `<p>${step.message}</p>`;
        clearHighlights();
        if (step.currentNode) {
            highlightNode(step.currentNode, true, step.type === 'process' ? '#4ade80' : '#fbbf24');
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
    
    const initialTreeInput = document.getElementById('initialTree').value.trim();
    
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
    } else {
        root = null;
    }
    
    if (!root) {
        alert('Tree is empty!');
        return;
    }
    
    renderTree();
    traversalOrder = [];
    document.getElementById('traversalOrder').textContent = '';
    
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
    
    const initialTreeInput = document.getElementById('initialTree').value.trim();
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
    } else {
        root = null;
    }
    
    renderTree();
    traversalOrder = [];
    document.getElementById('traversalOrder').textContent = '';
    document.getElementById('codeExplanation').innerHTML = 
        '<p>Click "Start Visualization" to see the algorithm in action!</p>';
    document.getElementById('initialTree').value = '50, 30, 70, 20, 40, 60, 80';
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
});
