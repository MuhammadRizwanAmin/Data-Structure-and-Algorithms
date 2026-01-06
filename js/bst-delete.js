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
let originalRoot = null;

// Build tree from array
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

// Find node and path to it
function findNodePath(value) {
    const path = [];
    let current = root;
    
    while (current) {
        path.push(current);
        if (value === current.value) {
            return path;
        } else if (value < current.value) {
            current = current.left;
        } else {
            current = current.right;
        }
    }
    
    return null;
}

// Find minimum value in subtree
function findMin(node) {
    while (node.left) {
        node = node.left;
    }
    return node;
}

// Calculate node positions
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

function highlightNode(value, highlight) {
    const nodeElement = document.querySelector(`.node-${value}`);
    if (nodeElement) {
        const rect = nodeElement.querySelector('rect');
        if (rect) {
            if (highlight) {
                rect.setAttribute('fill', '#ef4444');
                rect.setAttribute('stroke', '#dc2626');
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

// Deep copy tree
function copyTree(node) {
    if (!node) return null;
    const newNode = new TreeNode(node.value);
    newNode.left = copyTree(node.left);
    newNode.right = copyTree(node.right);
    return newNode;
}

function generateAnimationSteps(deleteValue) {
    const steps = [];
    const path = findNodePath(deleteValue);
    
    if (!path) {
        steps.push({
            type: 'error',
            message: `Value ${deleteValue} not found in the tree!`
        });
        return steps;
    }
    
    const targetNode = path[path.length - 1];
    
    // Step 1: Start at root
    steps.push({
        type: 'start',
        message: `Step 1: Start at root (${root.value})`,
        currentNode: root.value
    });
    
    // Steps for traversing to the node
    for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        const direction = next === current.left ? 'left' : 'right';
        
        steps.push({
            type: 'compare',
            message: `Step ${i + 2}: Compare ${deleteValue} with ${current.value}. ${deleteValue} ${deleteValue < current.value ? '<' : '>'} ${current.value}, go ${direction}`,
            currentNode: current.value
        });
        
        steps.push({
            type: 'move',
            message: `Step ${i + 3}: Move to ${direction} child (${next.value})`,
            currentNode: next.value
        });
    }
    
    // Found the node
    steps.push({
        type: 'found',
        message: `Step ${steps.length + 1}: Found node ${deleteValue} to delete`,
        targetNode: deleteValue
    });
    
    // Determine deletion case
    const hasLeft = targetNode.left !== null;
    const hasRight = targetNode.right !== null;
    
    if (!hasLeft && !hasRight) {
        // Case 1: No children
        steps.push({
            type: 'case1',
            message: `Step ${steps.length + 1}: Node has no children. Simply remove it.`,
            targetNode: deleteValue
        });
    } else if (!hasLeft || !hasRight) {
        // Case 2: One child
        const child = hasLeft ? targetNode.left : targetNode.right;
        steps.push({
            type: 'case2',
            message: `Step ${steps.length + 1}: Node has one child (${child.value}). Replace node with its child.`,
            targetNode: deleteValue,
            childValue: child.value
        });
    } else {
        // Case 3: Two children
        const successor = findMin(targetNode.right);
        steps.push({
            type: 'case3a',
            message: `Step ${steps.length + 1}: Node has two children. Find inorder successor (${successor.value}).`,
            targetNode: deleteValue,
            successorValue: successor.value
        });
        steps.push({
            type: 'case3b',
            message: `Step ${steps.length + 2}: Replace ${deleteValue} with ${successor.value}, then delete ${successor.value} from right subtree.`,
            targetNode: deleteValue,
            successorValue: successor.value
        });
    }
    
    // Delete
    steps.push({
        type: 'delete',
        message: `Step ${steps.length + 1}: Node ${deleteValue} deleted successfully!`,
        targetNode: deleteValue
    });
    
    // Complete
    steps.push({
        type: 'complete',
        message: `✓ Node ${deleteValue} successfully deleted!`,
        targetNode: deleteValue
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
        case 'compare':
        case 'move':
            highlightNode(step.currentNode, true);
            break;
            
        case 'found':
        case 'case1':
        case 'case2':
        case 'case3a':
        case 'case3b':
            highlightNode(step.targetNode, true);
            if (step.childValue) {
                highlightNode(step.childValue, true);
            }
            if (step.successorValue) {
                highlightNode(step.successorValue, true);
            }
            break;
            
        case 'delete':
            // Perform deletion
            root = deleteHelper(copyTree(originalRoot), parseInt(document.getElementById('deleteValue').value));
            renderTree();
            await sleep(100);
            break;
            
        case 'complete':
            clearHighlights();
            break;
            
        case 'error':
            alert(step.message);
            stopVisualization();
            break;
    }
    
    currentStepIndex++;
}

function deleteHelper(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
        node.left = deleteHelper(node.left, value);
    } else if (value > node.value) {
        node.right = deleteHelper(node.right, value);
    } else {
        if (!node.left) {
            return node.right;
        } else if (!node.right) {
            return node.left;
        }
        
        const minValue = findMin(node.right);
        node.value = minValue.value;
        node.right = deleteHelper(node.right, minValue.value);
    }
    
    return node;
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
    
    // Restore to original tree
    root = copyTree(originalRoot);
    
    // Re-execute steps up to currentStepIndex
    const deleteValue = parseInt(document.getElementById('deleteValue').value);
    animationSteps = generateAnimationSteps(deleteValue);
    
    for (let i = 0; i < currentStepIndex; i++) {
        const step = animationSteps[i];
        if (step.type === 'delete') {
            root = deleteHelper(copyTree(originalRoot), deleteValue);
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
        if (step.targetNode) {
            highlightNode(step.targetNode, true);
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
    const deleteValue = parseInt(document.getElementById('deleteValue').value);
    
    if (isNaN(deleteValue)) {
        alert('Please enter a valid number to delete!');
        return;
    }
    
    // Build initial tree
    if (initialTreeInput) {
        const values = initialTreeInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        root = buildTree(values);
        originalRoot = copyTree(root);
    } else {
        root = null;
        originalRoot = null;
    }
    
    if (!root) {
        alert('Tree is empty!');
        return;
    }
    
    // Check if value exists
    if (!findNodePath(deleteValue)) {
        alert(`Value ${deleteValue} not found in the tree!`);
        return;
    }
    
    renderTree();
    
    animationSteps = generateAnimationSteps(deleteValue);
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
        originalRoot = copyTree(root);
    } else {
        root = null;
        originalRoot = null;
    }
    
    renderTree();
    document.getElementById('codeExplanation').innerHTML = 
        '<p>Click "Start Visualization" to see the algorithm in action!</p>';
    document.getElementById('initialTree').value = '50, 30, 70, 20, 40, 60, 80';
    document.getElementById('deleteValue').value = '30';
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
    
    document.getElementById('deleteValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isVisualizing) {
            startVisualization();
        }
    });
});
