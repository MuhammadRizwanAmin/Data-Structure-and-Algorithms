let queueCapacity = 6;
let queue = [];
let front = 0;
let rear = -1;
let isAnimating = false;

// Initialize queue visualization
function initializeQueue() {
    const container = document.getElementById('queueContainer');
    container.innerHTML = '';
    
    // Create queue slots
    for (let i = 0; i < queueCapacity; i++) {
        const slot = document.createElement('div');
        slot.className = 'queue-slot';
        slot.id = `queueSlot${i}`;
        slot.innerHTML = '<div class="slot-content"></div>';
        container.appendChild(slot);
    }
    
    updatePointers();
    updateQueueDisplay();
}

// Update queue capacity
function updateQueueCapacity() {
    queueCapacity = parseInt(document.getElementById('queueCapacity').value) || 6;
    if (queueCapacity > 8) queueCapacity = 8;
    if (queueCapacity < 3) queueCapacity = 3;
    document.getElementById('queueCapacity').value = queueCapacity;
    
    queue = [];
    front = 0;
    rear = -1;
    initializeQueue();
}

// Update front and rear pointers
function updatePointers() {
    const frontArrow = document.getElementById('frontArrow');
    const rearArrow = document.getElementById('rearArrow');
    
    if (queue.length === 0) {
        frontArrow.style.display = 'none';
        rearArrow.style.display = 'none';
        return;
    }
    
    frontArrow.style.display = 'block';
    rearArrow.style.display = 'block';
    
    // Position front arrow
    const frontSlot = document.getElementById(`queueSlot${front}`);
    if (frontSlot) {
        const rect = frontSlot.getBoundingClientRect();
        const containerRect = document.getElementById('queueContainer').getBoundingClientRect();
        frontArrow.style.left = (rect.left + rect.width / 2 - containerRect.left - 12) + 'px';
    }
    
    // Position rear arrow
    const rearSlot = document.getElementById(`queueSlot${rear}`);
    if (rearSlot) {
        const rect = rearSlot.getBoundingClientRect();
        const containerRect = document.getElementById('queueContainer').getBoundingClientRect();
        rearArrow.style.left = (rect.left + rect.width / 2 - containerRect.left - 12) + 'px';
    }
}

// Update queue display
function updateQueueDisplay() {
    for (let i = 0; i < queueCapacity; i++) {
        const slot = document.getElementById(`queueSlot${i}`);
        const content = slot.querySelector('.slot-content');
        slot.classList.remove('filled');
        content.textContent = '';
    }
    
    // Display queue elements
    for (let i = 0; i < queue.length; i++) {
        const actualIndex = (front + i) % queueCapacity;
        const slot = document.getElementById(`queueSlot${actualIndex}`);
        const content = slot.querySelector('.slot-content');
        content.textContent = queue[i];
        slot.classList.add('filled');
    }
    
    updatePointers();
}

// Enqueue element
async function enqueue() {
    if (isAnimating) return;
    
    if (queue.length >= queueCapacity) {
        alert('Queue is full!');
        return;
    }
    
    isAnimating = true;
    document.getElementById('enqueueBtn').disabled = true;
    document.getElementById('dequeueBtn').disabled = true;
    
    const value = parseInt(document.getElementById('enqueueValue').value) || 10;
    
    if (isNaN(value)) {
        alert('Please enter a valid number!');
        isAnimating = false;
        document.getElementById('enqueueBtn').disabled = false;
        document.getElementById('dequeueBtn').disabled = false;
        return;
    }
    
    // Calculate new rear position
    if (queue.length === 0) {
        rear = 0;
        front = 0;
    } else {
        rear = (rear + 1) % queueCapacity;
    }
    
    // Animate element entering from right
    const slot = document.getElementById(`queueSlot${rear}`);
    const content = slot.querySelector('.slot-content');
    
    slot.classList.add('enqueuing');
    await sleep(400);
    
    // Add element
    queue.push(value);
    
    content.textContent = value;
    slot.classList.add('filled');
    slot.classList.remove('enqueuing');
    
    updatePointers();
    
    // Reset input
    document.getElementById('enqueueValue').value = '';
    
    isAnimating = false;
    document.getElementById('enqueueBtn').disabled = false;
    document.getElementById('dequeueBtn').disabled = false;
}

// Dequeue element
async function dequeue() {
    if (isAnimating) return;
    
    if (queue.length === 0) {
        alert('Queue is empty!');
        return;
    }
    
    isAnimating = true;
    document.getElementById('enqueueBtn').disabled = true;
    document.getElementById('dequeueBtn').disabled = true;
    
    // Animate element leaving from front
    const slot = document.getElementById(`queueSlot${front}`);
    slot.classList.add('dequeuing');
    await sleep(400);
    
    // Remove element
    queue.shift();
    if (queue.length === 0) {
        front = 0;
        rear = -1;
    } else {
        front = (front + 1) % queueCapacity;
    }
    
    slot.classList.remove('filled', 'dequeuing');
    slot.querySelector('.slot-content').textContent = '';
    
    updateQueueDisplay();
    
    isAnimating = false;
    document.getElementById('enqueueBtn').disabled = false;
    document.getElementById('dequeueBtn').disabled = false;
}

// Reset queue
function resetQueue() {
    if (isAnimating) return;
    
    queue = [];
    front = 0;
    rear = -1;
    initializeQueue();
    document.getElementById('enqueueValue').value = '10';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
    initializeQueue();
    
    document.getElementById('enqueueBtn').addEventListener('click', enqueue);
    document.getElementById('dequeueBtn').addEventListener('click', dequeue);
    document.getElementById('resetBtn').addEventListener('click', resetQueue);
    
    // Allow Enter key to enqueue
    document.getElementById('enqueueValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enqueue();
        }
    });
});

window.updateQueueCapacity = updateQueueCapacity;

