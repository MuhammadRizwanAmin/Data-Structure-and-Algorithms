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
let isAnimating = false;
const MAX_NODES = 10;

// Count nodes in tree
function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

// Calculate node positions for tree visualization
function calculatePositions(node, level, x, minX) {
    if (!node) return minX;
    
    const nodeWidth = 80;
    const nodeHeight = 60;
    const horizontalSpacing = 100;
    const verticalSpacing = 100;
    
    // Calculate position for left subtree
    const leftX = calculatePositions(node.left, level + 1, x, minX);
    
    // Position current node
    node.x = leftX + nodeWidth / 2;
    node.y = level * verticalSpacing + nodeHeight / 2;
    
    // Calculate position for right subtree
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
    
    // Calculate positions
    calculatePositions(root, 0, 0, 0);
    
    // Create SVG for tree visualization
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '600');
    svg.style.overflow = 'visible';
    
    // Draw edges first (so they appear behind nodes)
    drawEdges(svg, root);
    
    // Draw nodes
    drawNodes(svg, root);
    
    container.appendChild(svg);
}

// Draw edges (lines connecting nodes)
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
    
    // Draw left subtree
    drawNodes(svg, node.left);
    
    // Draw current node
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `bst-node node-${node.value}`);
    
    // Node circle/rectangle
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
    
    // Node value text
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
    
    // Draw right subtree
    drawNodes(svg, node.right);
}

// Insert a value into BST
async function insertValue(value) {
    if (isAnimating) return;
    
    if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
    }
    
    // Check if max nodes reached
    const currentCount = countNodes(root);
    if (currentCount >= MAX_NODES) {
        alert(`Maximum number of nodes (${MAX_NODES}) reached. Please reset to insert more.`);
        return;
    }
    
    // Check if value already exists
    if (searchHelper(root, value)) {
        alert('Value already exists in the tree!');
        return;
    }
    
    isAnimating = true;
    document.getElementById('insertBtn').disabled = true;
    
    root = insertHelper(root, value);
    
    // Animate insertion
    await animateInsertion(value);
    
    renderTree();
    updateInsertControls();
    
    isAnimating = false;
    // updateInsertControls() will handle enabling/disabling the button
    document.getElementById('insertValue').value = '';
}

// Update insert controls based on node count
function updateInsertControls() {
    const currentCount = countNodes(root);
    const insertInput = document.getElementById('insertValue');
    const insertBtn = document.getElementById('insertBtn');
    const maxLimitMessage = document.getElementById('maxLimitMessage');
    
    if (currentCount >= MAX_NODES) {
        insertInput.disabled = true;
        insertBtn.disabled = true;
        maxLimitMessage.style.display = 'block';
    } else {
        insertInput.disabled = false;
        insertBtn.disabled = false;
        maxLimitMessage.style.display = 'none';
    }
}

// Helper function for search (used to check duplicates)
function searchHelper(node, value) {
    if (!node) return false;
    if (node.value === value) return true;
    if (value < node.value) return searchHelper(node.left, value);
    return searchHelper(node.right, value);
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

// Animate insertion
async function animateInsertion(value) {
    await sleep(300);
}


// Highlight a node
function highlightNode(value, highlight) {
    const nodeElement = document.querySelector(`.node-${value}`);
    if (nodeElement) {
        const rect = nodeElement.querySelector('rect');
        if (rect) {
            if (highlight) {
                rect.setAttribute('fill', '#4ade80');
                rect.setAttribute('stroke', '#22c55e');
            } else {
                rect.setAttribute('fill', '#667eea');
                rect.setAttribute('stroke', '#764ba2');
            }
        }
    }
}

// Reset tree
function resetTree() {
    if (isAnimating) return;
    
    root = null;
    renderTree();
    document.getElementById('insertValue').value = '50';
    updateInsertControls();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    renderTree();
    updateInsertControls();
    
    document.getElementById('insertBtn').addEventListener('click', () => {
        const value = parseInt(document.getElementById('insertValue').value);
        insertValue(value);
    });
    
    document.getElementById('resetBtn').addEventListener('click', resetTree);
    
    // Allow Enter key
    document.getElementById('insertValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('insertBtn').disabled) {
            const value = parseInt(document.getElementById('insertValue').value);
            insertValue(value);
        }
    });
});
