let nodeCount = 6;
let nodes = [];
let nodeInputs = [];
let isVisualizing = false;
let currentVisualizationIndex = 0;
let visualizationMode = 'step'; // 'step' or 'auto'
let visualizationTimeout = null;
let currentAnimationPromise = null;

// Initialize node inputs
function updateNodeInputs() {
    nodeCount = parseInt(document.getElementById('nodeCount').value) || 6;
    if (nodeCount > 6) nodeCount = 6;
    if (nodeCount < 1) nodeCount = 1;
    document.getElementById('nodeCount').value = nodeCount;

    const container = document.getElementById('nodesInputContainer');
    container.innerHTML = '';
    nodeInputs = [];

    for (let i = 0; i < nodeCount; i++) {
        const item = document.createElement('div');
        item.className = 'node-input-item';
        const inputId = `nodeInput${i}`;
        item.innerHTML = `
            <label>Node ${i}:</label>
            <input type="number" id="${inputId}" value="${Math.floor(Math.random() * 100)}">
        `;
        container.appendChild(item);
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            nodeInputs.push(inputElement);
        }
    }
}

// Get nodes from inputs
function getNodesFromInputs() {
    const nodeValues = [];
    for (let i = 0; i < nodeCount; i++) {
        const value = parseInt(document.getElementById(`nodeInput${i}`).value) || 0;
        nodeValues.push(value);
    }
    return nodeValues;
}

// Start visualization with animation
async function startVisualization() {
    if (isVisualizing) return;
    
    // Get visualization mode
    visualizationMode = document.querySelector('input[name="visualizationMode"]:checked').value;
    
    nodes = getNodesFromInputs();
    currentVisualizationIndex = 0;
    
    if (nodes.length === 0) {
        const container = document.getElementById('nodesContainer');
        container.innerHTML = '<div class="empty-state"><i class="fas fa-list"></i><p>Please add at least one node.</p></div>';
        return;
    }
    
    // Clear previous visualization
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');
    container.innerHTML = '';
    headPointer.style.width = '0';
    
    isVisualizing = true;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('resetBtn').disabled = false; // Keep reset enabled
    
    // Show head pointer first
    await new Promise(resolve => {
        visualizationTimeout = setTimeout(resolve, 300);
    });
    if (!isVisualizing) return; // Check if reset was called
    
    headPointer.style.width = '50px';
    
    if (visualizationMode === 'auto') {
        // Auto play mode - add all nodes automatically
        document.getElementById('addNextBtn').style.display = 'none';
        for (let i = 0; i < nodes.length; i++) {
            if (!isVisualizing) break; // Stop if reset was called
            currentAnimationPromise = addNodeWithAnimation(nodes[i], i);
            await currentAnimationPromise;
            currentAnimationPromise = null;
        }
        if (isVisualizing) {
            isVisualizing = false;
            document.getElementById('startBtn').style.display = 'inline-block';
        }
    } else {
        // Step by step mode - show "Add Next Node" button
        document.getElementById('addNextBtn').style.display = 'inline-block';
        document.getElementById('addNextBtn').disabled = false;
        currentAnimationPromise = addNodeWithAnimation(nodes[0], 0);
        await currentAnimationPromise;
        currentAnimationPromise = null;
        
        if (!isVisualizing) return; // Check if reset was called
        
        currentVisualizationIndex = 1;
        
        if (currentVisualizationIndex >= nodes.length) {
            // All nodes added
            isVisualizing = false;
            document.getElementById('addNextBtn').style.display = 'none';
            document.getElementById('startBtn').style.display = 'inline-block';
        }
    }
}

// Add next node (for step-by-step mode)
async function addNextNode() {
    if (!isVisualizing || currentVisualizationIndex >= nodes.length) return;
    
    document.getElementById('addNextBtn').disabled = true;
    currentAnimationPromise = addNodeWithAnimation(nodes[currentVisualizationIndex], currentVisualizationIndex);
    await currentAnimationPromise;
    currentAnimationPromise = null;
    
    if (!isVisualizing) return; // Check if reset was called
    
    currentVisualizationIndex++;
    
    if (currentVisualizationIndex >= nodes.length) {
        // All nodes added
        isVisualizing = false;
        document.getElementById('addNextBtn').style.display = 'none';
        document.getElementById('startBtn').style.display = 'inline-block';
    } else {
        document.getElementById('addNextBtn').disabled = false;
    }
}

// Add a single node with animation
function addNodeWithAnimation(value, index) {
    return new Promise((resolve) => {
        if (!isVisualizing) {
            resolve();
            return;
        }
        
        const container = document.getElementById('nodesContainer');
        
        // Create node wrapper
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'linkedlist-node';
        nodeWrapper.style.opacity = '0';
        nodeWrapper.style.transform = 'scale(0.8)';
        
        // Create node box
        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';
        
        // Data part
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = value;
        
        // Pointer part
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        if (index === nodes.length - 1) {
            pointerDiv.classList.add('null');
        }
        
        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        nodeWrapper.appendChild(nodeBox);
        
        // Add arrow connector (except for first node)
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-connector';
            arrow.style.width = '0';
            arrow.style.opacity = '0';
            container.appendChild(arrow);
            
            // Animate arrow
            const arrowTimeout = setTimeout(() => {
                if (!isVisualizing) {
                    resolve();
                    return;
                }
                arrow.style.transition = 'width 0.5s ease, opacity 0.5s ease';
                arrow.style.width = '50px';
                arrow.style.opacity = '1';
            }, 100);
        }
        
        container.appendChild(nodeWrapper);
        
        // Animate node appearance
        const nodeTimeout = setTimeout(() => {
            if (!isVisualizing) {
                resolve();
                return;
            }
            nodeWrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            nodeWrapper.style.opacity = '1';
            nodeWrapper.style.transform = 'scale(1)';
            
            // Resolve after animation completes
            const resolveTimeout = setTimeout(() => {
                if (isVisualizing) {
                    resolve();
                }
            }, 600);
        }, index > 0 ? 300 : 0);
    });
}

// Render complete linked list (for reset/initial state)
function renderLinkedList() {
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');

    if (nodes.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-list"></i><p>No nodes added yet. Click "Start Visualization" to visualize the linked list.</p></div>';
        headPointer.style.width = '0';
        return;
    }

    // Show head pointer
    headPointer.style.width = '50px';

    // Clear container
    container.innerHTML = '';

    // Create all nodes at once
    nodes.forEach((value, index) => {
        // Add arrow connector (except for first node)
        if (index > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'arrow-connector';
            arrow.style.width = '50px';
            arrow.style.opacity = '1';
            container.appendChild(arrow);
        }

        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'linkedlist-node';

        const nodeBox = document.createElement('div');
        nodeBox.className = 'node-box';

        // Data part
        const dataDiv = document.createElement('div');
        dataDiv.className = 'node-data';
        dataDiv.textContent = value;

        // Pointer part
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'node-pointer';
        if (index === nodes.length - 1) {
            pointerDiv.classList.add('null');
        }

        nodeBox.appendChild(dataDiv);
        nodeBox.appendChild(pointerDiv);
        nodeWrapper.appendChild(nodeBox);
        container.appendChild(nodeWrapper);
    });
}

// Reset visualization
function resetVisualization() {
    // Stop any ongoing visualization
    isVisualizing = false;
    currentVisualizationIndex = 0;
    
    // Clear any pending timeouts
    if (visualizationTimeout) {
        clearTimeout(visualizationTimeout);
        visualizationTimeout = null;
    }
    
    // Clear nodes array
    nodes = [];
    
    // Clear the visualization container
    const container = document.getElementById('nodesContainer');
    const headPointer = document.getElementById('headPointer');
    container.innerHTML = '';
    headPointer.style.width = '0';
    
    // Reset inputs with new random values
    updateNodeInputs();
    
    // Reset UI buttons
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('addNextBtn').style.display = 'none';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('addNextBtn').disabled = false;
    
    // Render empty state
    renderLinkedList();
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    updateNodeInputs();
    renderLinkedList();

    document.getElementById('startBtn').addEventListener('click', startVisualization);
    document.getElementById('addNextBtn').addEventListener('click', addNextNode);
    document.getElementById('resetBtn').addEventListener('click', resetVisualization);
});

// Make updateNodeInputs available globally
window.updateNodeInputs = updateNodeInputs;
