// Data Structure data
const dataStructures = {
    'linkedlist': {
        name: 'Linked List',
        code: `struct Node {
    int data;
    Node* next;
    
    Node(int val) {
        data = val;
        next = nullptr;
    }
};

class LinkedList {
private:
    Node* head;
    
public:
    LinkedList() {
        head = nullptr;
    }
    
    // Insert at the end
    void insertAtEnd(int data) {
        Node* newNode = new Node(data);
        if (head == nullptr) {
            head = newNode;
            return;
        }
        Node* temp = head;
        while (temp->next != nullptr) {
            temp = temp->next;
        }
        temp->next = newNode;
    }
    
    // Insert at the beginning
    void insertAtStart(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
    }
    
    // Display the list
    void display() {
        Node* temp = head;
        while (temp != nullptr) {
            cout << temp->data << " -> ";
            temp = temp->next;
        }
        cout << "NULL" << endl;
    }
    
    // Destructor to free memory
    ~LinkedList() {
        Node* temp;
        while (head != nullptr) {
            temp = head;
            head = head->next;
            delete temp;
        }
    }
};`,
        pros: [
            'Dynamic size - can grow or shrink during runtime',
            'Efficient insertion and deletion at any position',
            'No memory waste - allocates memory as needed',
            'Easy to implement and understand',
            'Flexible for operations like reversing, merging'
        ],
        cons: [
            'Extra memory required for storing pointers',
            'No random access - must traverse from head',
            'Sequential access only - cannot jump to middle',
            'Cache performance is poor compared to arrays',
            'More complex than arrays for simple operations'
        ],
        examples: [
            {
                title: 'Example 1: Basic Linked List',
                description: 'A linked list with nodes containing values [10, 20, 30]. Each node points to the next node, with the last node pointing to NULL.'
            },
            {
                title: 'Example 2: Insertion at End',
                description: 'To add a new node with value 40 at the end, traverse to the last node and make it point to the new node, which points to NULL.'
            }
        ],
        useCases: [
            'Implementing stacks and queues',
            'Dynamic memory allocation scenarios',
            'Applications requiring frequent insertions/deletions',
            'Implementing graphs and trees',
            'Memory-efficient implementations where size is unknown'
        ],
        algorithms: [
            {
                id: 'linkedlist-insert-end',
                name: 'Insert at End',
                description: 'Add a new node at the end of the linked list'
            },
            {
                id: 'linkedlist-insert-start',
                name: 'Insert at Start',
                description: 'Add a new node at the beginning of the linked list'
            },
            {
                id: 'linkedlist-insert-position',
                name: 'Insert at Specific Position',
                description: 'Insert a new node at a given position in the linked list'
            },
            {
                id: 'linkedlist-delete',
                name: 'Delete Node',
                description: 'Delete a node with a given value from the linked list'
            }
        ]
    },
    'queue': {
        name: 'Queue',
        code: `class Queue {
private:
    int* arr;
    int front;
    int rear;
    int capacity;
    int size;
    
public:
    Queue(int cap) {
        capacity = cap;
        arr = new int[capacity];
        front = 0;
        rear = -1;
        size = 0;
    }
    
    bool isEmpty() {
        return size == 0;
    }
    
    bool isFull() {
        return size == capacity;
    }
    
    void enqueue(int data) {
        if (isFull()) {
            cout << "Queue is full!" << endl;
            return;
        }
        rear = (rear + 1) % capacity;
        arr[rear] = data;
        size++;
    }
    
    int dequeue() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return -1;
        }
        int data = arr[front];
        front = (front + 1) % capacity;
        size--;
        return data;
    }
    
    int peek() {
        if (isEmpty()) return -1;
        return arr[front];
    }
};`,
        pros: [
            'Simple and easy to understand',
            'Efficient insertion and deletion (O(1))',
            'FIFO principle ensures fair processing',
            'Useful for task scheduling',
            'Foundation for many algorithms'
        ],
        cons: [
            'Fixed size in array implementation',
            'Cannot access middle elements directly',
            'Limited operations compared to other structures',
            'Memory waste in circular queue if not managed',
            'No random access to elements'
        ],
        examples: [
            {
                title: 'Example 1: Basic Queue',
                description: 'A queue with elements [10, 20, 30]. Front points to 10, rear points to 30. Elements are processed in order: 10, then 20, then 30.'
            },
            {
                title: 'Example 2: Enqueue Operation',
                description: 'Adding 40 to the queue: rear moves to next position, 40 is inserted at rear. Queue becomes [10, 20, 30, 40].'
            },
            {
                title: 'Example 3: Dequeue Operation',
                description: 'Removing element: front element (10) is removed, front pointer moves to next position. Queue becomes [20, 30, 40].'
            }
        ],
        useCases: [
            'CPU scheduling and task management',
            'Breadth-First Search (BFS) algorithm',
            'Print spooler and job queues',
            'Message queues in operating systems',
            'Call center phone systems',
            'Buffer for data streams'
        ],
        algorithms: [
            {
                id: 'queue-enqueue',
                name: 'Enqueue',
                description: 'Add an element to the rear of the queue'
            },
            {
                id: 'queue-dequeue',
                name: 'Dequeue',
                description: 'Remove an element from the front of the queue'
            },
            {
                id: 'queue-front',
                name: 'Front/Peek',
                description: 'View the front element without removing it'
            }
        ]
    }
};

// Load data structure details
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dsId = urlParams.get('ds');

    if (!dsId || !dataStructures[dsId]) {
        window.location.href = 'data-structures.html';
        return;
    }

    const dataStructure = dataStructures[dsId];
    const content = document.getElementById('dataStructureContent');

    content.innerHTML = `
        <div class="algorithm-header">
            <div class="header-title-section">
                <h1>${dataStructure.name}</h1>
            </div>
            <a href="${dsId === 'linkedlist' ? 'html/linkedlist.html' : 'html/queue.html'}" class="visualize-btn">
                <i class="fas fa-eye"></i> Interactive Visualization
            </a>
        </div>

        <div class="content-section">
            <h2>Basic Implementation</h2>
            <div class="code-block">
                <pre><code class="language-cpp">${dataStructure.code}</code></pre>
            </div>
        </div>

        <div class="content-section">
            <h2>Pros and Cons</h2>
            <div class="pros-cons">
                <div class="pros">
                    <h3>✅ Advantages</h3>
                    <ul>
                        ${dataStructure.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons">
                    <h3>❌ Disadvantages</h3>
                    <ul>
                        ${dataStructure.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="content-section">
            <h2>Examples</h2>
            <div class="examples">
                ${dataStructure.examples.map(example => `
                    <div class="example-item">
                        <h4>${example.title}</h4>
                        <p>${example.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="content-section">
            <h2>Where It's Used</h2>
            <div class="use-cases">
                ${dataStructure.useCases.map(useCase => `
                    <div class="use-case-item">${useCase}</div>
                `).join('')}
            </div>
        </div>

        <div class="content-section">
            <h2>Algorithms for ${dataStructure.name}</h2>
            <p>Explore algorithms specific to ${dataStructure.name}:</p>
            <div class="algorithms-list">
                ${dataStructure.algorithms.map(alg => `
                    <div class="algorithm-item" onclick="window.location.href='algorithm.html?alg=${alg.id}'">
                        <h4>${alg.name}</h4>
                        <p>${alg.description}</p>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                `).join('')}
            </div>
        </div>

    `;

    // Trigger Prism syntax highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});

