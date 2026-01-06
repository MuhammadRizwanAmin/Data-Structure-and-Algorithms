// Algorithm data
const algorithms = {
    'bubble-sort': {
        name: 'Bubble Sort',
        complexity: 'O(n²)',
        code: `void bubbleSort(int arr[], int n) {
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
        pros: [
            'Simple to understand and implement',
            'In-place sorting (requires O(1) extra space)',
            'Stable sorting algorithm',
            'Adaptive (can detect if array is already sorted)'
        ],
        cons: [
            'Very slow for large datasets',
            'Time complexity of O(n²) in worst and average cases',
            'Not efficient for real-world applications',
            'Many unnecessary comparisons'
        ],
        examples: [
            {
                title: 'Example 1: Basic Sorting',
                description: 'Sorting array [64, 34, 25, 12, 22, 11, 90] step by step. The algorithm compares adjacent elements and swaps them if they are in wrong order.'
            },
            {
                title: 'Example 2: Already Sorted Array',
                description: 'For an already sorted array [1, 2, 3, 4, 5], bubble sort can be optimized to detect this and stop early, making it O(n) in best case.'
            }
        ],
        useCases: [
            'Educational purposes to understand sorting concepts',
            'Small datasets (less than 50 elements)',
            'When simplicity is more important than efficiency',
            'As a teaching tool for algorithm visualization'
        ]
    },
    'selection-sort': {
        name: 'Selection Sort',
        complexity: 'O(n²)',
        code: `void selectionSort(int arr[], int n) {
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
        pros: [
            'Simple and easy to understand',
            'In-place sorting (O(1) extra space)',
            'Performs well on small lists',
            'Minimal number of swaps (at most n swaps)'
        ],
        cons: [
            'Time complexity of O(n²) in all cases',
            'Not stable (may change relative order of equal elements)',
            'Not adaptive (doesn\'t benefit from partially sorted arrays)',
            'Inefficient for large datasets'
        ],
        examples: [
            {
                title: 'Example 1: Finding Minimum',
                description: 'For array [64, 25, 12, 22, 11], the algorithm finds the minimum element (11) and places it at the beginning, then repeats for remaining elements.'
            },
            {
                title: 'Example 2: Comparison with Other Sorts',
                description: 'Selection sort makes fewer swaps than bubble sort but still requires O(n²) comparisons, making it inefficient for large arrays.'
            }
        ],
        useCases: [
            'Small datasets where simplicity matters',
            'When memory writes are expensive (minimal swaps)',
            'Educational purposes',
            'Situations where auxiliary memory is limited'
        ]
    },
    'insertion-sort': {
        name: 'Insertion Sort',
        complexity: 'O(n²)',
        code: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
        pros: [
            'Simple implementation',
            'Efficient for small datasets',
            'Adaptive (efficient for nearly sorted arrays)',
            'Stable sorting algorithm',
            'In-place sorting (O(1) extra space)',
            'Online algorithm (can sort as it receives input)'
        ],
        cons: [
            'Time complexity of O(n²) in worst and average cases',
            'Inefficient for large datasets',
            'Many shifts required for unsorted arrays',
            'Not suitable for real-time applications with large data'
        ],
        examples: [
            {
                title: 'Example 1: Card Sorting',
                description: 'Similar to how you sort playing cards in your hand. You pick a card and insert it in the correct position among already sorted cards.'
            },
            {
                title: 'Example 2: Nearly Sorted Array',
                description: 'For a nearly sorted array, insertion sort performs very well, approaching O(n) time complexity, making it faster than other O(n²) algorithms.'
            }
        ],
        useCases: [
            'Small datasets (typically less than 50 elements)',
            'Nearly sorted arrays',
            'As a subroutine in more efficient algorithms (like Timsort)',
            'Online sorting where data arrives one at a time',
            'Hybrid sorting algorithms'
        ]
    },
    'linear-search': {
        name: 'Linear Search',
        complexity: 'O(n)',
        code: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;  // Element found at index i
        }
    }
    return -1;  // Element not found
}`,
        pros: [
            'Simple to understand and implement',
            'Works on both sorted and unsorted arrays',
            'No preprocessing required',
            'Can find first occurrence of duplicate elements',
            'Works with any data type'
        ],
        cons: [
            'Time complexity of O(n) in worst case',
            'Inefficient for large datasets',
            'Must check every element in worst case',
            'Slower than binary search for sorted arrays'
        ],
        examples: [
            {
                title: 'Example 1: Finding an Element',
                description: 'Searching for 25 in array [10, 20, 30, 25, 40]. The algorithm checks each element sequentially: 10 (no), 20 (no), 30 (no), 25 (found at index 3).'
            },
            {
                title: 'Example 2: Element Not Found',
                description: 'Searching for 50 in array [10, 20, 30, 40]. The algorithm checks all elements but doesn\'t find 50, returning -1.'
            }
        ],
        useCases: [
            'Small arrays or unsorted data',
            'When data is not sorted',
            'Finding first occurrence in unsorted data',
            'Simple search operations where simplicity matters',
            'When you need to search through linked lists'
        ]
    },
    'binary-search': {
        name: 'Binary Search',
        complexity: 'O(log n)',
        code: `int binarySearch(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;  // Element found
        }
        
        if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1;  // Search left half
        }
    }
    
    return -1;  // Element not found
}`,
        pros: [
            'Very efficient with O(log n) time complexity',
            'Much faster than linear search for large datasets',
            'Optimal for sorted arrays',
            'Reduces search space by half in each iteration',
            'Works well with large datasets'
        ],
        cons: [
            'Requires the array to be sorted',
            'More complex to implement than linear search',
            'Not suitable for unsorted data',
            'Requires random access (not suitable for linked lists)',
            'Slightly more memory overhead'
        ],
        examples: [
            {
                title: 'Example 1: Finding an Element',
                description: 'Searching for 25 in sorted array [10, 20, 25, 30, 40]. First checks middle (25), finds it immediately. Only 1 comparison needed!'
            },
            {
                title: 'Example 2: Multiple Iterations',
                description: 'Searching for 30 in [10, 20, 25, 30, 40, 50, 60]. Checks mid=30 (found). In worst case, would need at most log₂(7) ≈ 3 comparisons.'
            }
        ],
        useCases: [
            'Searching in sorted arrays',
            'Large datasets where efficiency matters',
            'Database search operations',
            'Searching in sorted lists or trees',
            'When you need fast lookup operations'
        ]
    },
    'linkedlist-insert-end': {
        name: 'Linked List - Insert at End',
        complexity: 'O(n)',
        code: `void insertAtEnd(Node*& head, int data) {
    Node* newNode = new Node();
    newNode->data = data;
    newNode->next = nullptr;
    
    if (head == nullptr) {
        head = newNode;
        return;
    }
    
    Node* temp = head;
    while (temp->next != nullptr) {
        temp = temp->next;
    }
    temp->next = newNode;
}`,
        pros: [
            'Simple to implement',
            'Maintains list order',
            'Works for empty lists'
        ],
        cons: [
            'Time complexity O(n) - must traverse to end',
            'Requires traversal of entire list'
        ],
        examples: [
            {
                title: 'Example: Adding to End',
                description: 'To add value 30 to end of list [10, 20], traverse to node with 20, then set its next pointer to new node with 30.'
            }
        ],
        useCases: [
            'Building a linked list sequentially',
            'Adding elements when order matters',
            'Implementing queue data structure'
        ]
    },
    'linkedlist-insert-start': {
        name: 'Linked List - Insert at Start',
        complexity: 'O(1)',
        code: `void insertAtStart(Node*& head, int data) {
    Node* newNode = new Node();
    newNode->data = data;
    newNode->next = head;
    head = newNode;
}`,
        pros: [
            'Very efficient - O(1) time complexity',
            'Simple implementation',
            'Works for empty lists'
        ],
        cons: [
            'Changes the head pointer',
            'Reverses insertion order'
        ],
        examples: [
            {
                title: 'Example: Adding to Start',
                description: 'To add value 5 at start of list [10, 20], create new node with 5, point it to head, then update head to point to new node.'
            }
        ],
        useCases: [
            'Implementing stack data structure',
            'Reversing insertion order',
            'When constant time insertion is needed'
        ]
    },
    'linkedlist-insert-position': {
        name: 'Linked List - Insert at Position',
        complexity: 'O(n)',
        code: `void insertAtPosition(Node*& head, int data, int position) {
    Node* newNode = new Node();
    newNode->data = data;
    
    if (position == 0) {
        newNode->next = head;
        head = newNode;
        return;
    }
    
    Node* temp = head;
    for (int i = 0; i < position - 1 && temp != nullptr; i++) {
        temp = temp->next;
    }
    
    if (temp != nullptr) {
        newNode->next = temp->next;
        temp->next = newNode;
    }
}`,
        pros: [
            'Flexible insertion at any position',
            'Maintains list structure',
            'Can insert at beginning'
        ],
        cons: [
            'Time complexity O(n)',
            'Requires position validation',
            'Must traverse to position'
        ],
        examples: [
            {
                title: 'Example: Insert at Position 2',
                description: 'To insert 15 at position 2 in list [10, 20, 30], traverse to position 1, then insert new node between nodes at positions 1 and 2.'
            }
        ],
        useCases: [
            'Maintaining sorted lists',
            'Inserting at specific indices',
            'Dynamic list manipulation'
        ]
    },
    'linkedlist-delete': {
        name: 'Linked List - Delete Node',
        complexity: 'O(n)',
        code: `void deleteNode(Node*& head, int data) {
    if (head == nullptr) return;
    
    if (head->data == data) {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    
    Node* temp = head;
    while (temp->next != nullptr && temp->next->data != data) {
        temp = temp->next;
    }
    
    if (temp->next != nullptr) {
        Node* toDelete = temp->next;
        temp->next = temp->next->next;
        delete toDelete;
    }
}`,
        pros: [
            'Removes specific value',
            'Handles head deletion',
            'Memory efficient'
        ],
        cons: [
            'Time complexity O(n)',
            'Must traverse to find node',
            'Requires memory management'
        ],
        examples: [
            {
                title: 'Example: Delete Value 20',
                description: 'To delete 20 from list [10, 20, 30], find node with 20, update previous node\'s next pointer to skip it, then delete the node.'
            }
        ],
        useCases: [
            'Removing specific elements',
            'List maintenance operations',
            'Memory cleanup in dynamic lists'
        ]
    },
    'queue-enqueue': {
        name: 'Queue - Enqueue',
        complexity: 'O(1)',
        code: `void enqueue(Queue& q, int data) {
    if (q.isFull()) {
        cout << "Queue is full!" << endl;
        return;
    }
    q.rear = (q.rear + 1) % q.capacity;
    q.arr[q.rear] = data;
    q.size++;
}`,
        pros: [
            'Constant time complexity O(1)',
            'Simple implementation',
            'Efficient insertion'
        ],
        cons: [
            'Requires checking if queue is full',
            'Fixed size limitation',
            'May need resizing for dynamic queues'
        ],
        examples: [
            {
                title: 'Example: Adding Element',
                description: 'To add 40 to queue [10, 20, 30], rear moves to next position (3), 40 is inserted. Queue becomes [10, 20, 30, 40].'
            }
        ],
        useCases: [
            'Adding tasks to processing queue',
            'Inserting elements in BFS traversal',
            'Building queues for job scheduling'
        ]
    },
    'queue-dequeue': {
        name: 'Queue - Dequeue',
        complexity: 'O(1)',
        code: `int dequeue(Queue& q) {
    if (q.isEmpty()) {
        cout << "Queue is empty!" << endl;
        return -1;
    }
    int data = q.arr[q.front];
    q.front = (q.front + 1) % q.capacity;
    q.size--;
    return data;
}`,
        pros: [
            'Constant time complexity O(1)',
            'Simple and efficient removal',
            'Maintains FIFO order'
        ],
        cons: [
            'Requires checking if queue is empty',
            'Front element is removed',
            'Cannot access removed element after dequeue'
        ],
        examples: [
            {
                title: 'Example: Removing Element',
                description: 'To remove from queue [10, 20, 30], front element (10) is returned, front moves to next position (1). Queue becomes [20, 30].'
            }
        ],
        useCases: [
            'Processing tasks in order',
            'BFS traversal of graphs',
            'Job execution from queue'
        ]
    },
    'queue-front': {
        name: 'Queue - Front/Peek',
        complexity: 'O(1)',
        code: `int front(Queue& q) {
    if (q.isEmpty()) {
        cout << "Queue is empty!" << endl;
        return -1;
    }
    return q.arr[q.front];
}`,
        pros: [
            'Constant time complexity O(1)',
            'Does not modify queue',
            'Quick access to front element'
        ],
        cons: [
            'Only accesses front element',
            'Does not remove element',
            'Returns -1 if queue is empty'
        ],
        examples: [
            {
                title: 'Example: Viewing Front',
                description: 'For queue [10, 20, 30], front() returns 10 without removing it. Queue remains [10, 20, 30].'
            }
        ],
        useCases: [
            'Checking next element to process',
            'Priority-based operations',
            'Preview without removal'
        ]
    },
    'bst-insert': {
        name: 'BST - Insert',
        complexity: 'O(log n)',
        code: `TreeNode* insert(TreeNode* root, int data) {
    if (root == nullptr) {
        return new TreeNode(data);
    }
    
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    
    return root;
}`,
        pros: [
            'Average time complexity O(log n)',
            'Maintains BST property automatically',
            'Simple recursive implementation',
            'Efficient for balanced trees'
        ],
        cons: [
            'Worst case O(n) for skewed trees',
            'Requires tree balancing for optimal performance',
            'Recursive calls use stack space'
        ],
        examples: [
            {
                title: 'Example: Insert 35',
                description: 'Start at root (50), 35 < 50 go left to 30, 35 > 30 go right to 40, 35 < 40 insert as left child of 40.'
            }
        ],
        useCases: [
            'Building BST from unsorted data',
            'Adding elements to existing BST',
            'Dynamic data structure maintenance'
        ]
    },
    'bst-delete': {
        name: 'BST - Delete',
        complexity: 'O(log n)',
        code: `TreeNode* deleteNode(TreeNode* root, int data) {
    if (root == nullptr) return root;
    
    if (data < root->data) {
        root->left = deleteNode(root->left, data);
    } else if (data > root->data) {
        root->right = deleteNode(root->right, data);
    } else {
        // Node with one or no child
        if (root->left == nullptr) {
            TreeNode* temp = root->right;
            delete root;
            return temp;
        } else if (root->right == nullptr) {
            TreeNode* temp = root->left;
            delete root;
            return temp;
        }
        
        // Node with two children: get inorder successor
        TreeNode* temp = minValueNode(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}`,
        pros: [
            'Average time complexity O(log n)',
            'Maintains BST property after deletion',
            'Handles all three cases (0, 1, 2 children)',
            'Efficient for balanced trees'
        ],
        cons: [
            'Worst case O(n) for skewed trees',
            'Complex logic for nodes with two children',
            'Requires finding inorder successor'
        ],
        examples: [
            {
                title: 'Example: Delete Node with Two Children',
                description: 'To delete node 50: Find inorder successor (60), replace 50 with 60, delete original 60 node.'
            }
        ],
        useCases: [
            'Removing elements from BST',
            'Maintaining sorted order after deletion',
            'Dynamic data structure updates'
        ]
    },
    'bst-search': {
        name: 'BST - Search',
        complexity: 'O(log n)',
        code: `TreeNode* search(TreeNode* root, int data) {
    if (root == nullptr || root->data == data) {
        return root;
    }
    
    if (data < root->data) {
        return search(root->left, data);
    }
    
    return search(root->right, data);
}`,
        pros: [
            'Average time complexity O(log n)',
            'Much faster than linear search',
            'Simple recursive implementation',
            'Efficient for balanced trees'
        ],
        cons: [
            'Worst case O(n) for skewed trees',
            'Requires tree to be a valid BST',
            'Recursive calls use stack space'
        ],
        examples: [
            {
                title: 'Example: Search for 60',
                description: 'Start at root (50), 60 > 50 go right to 70, 60 < 70 go left to 60, found!'
            }
        ],
        useCases: [
            'Finding elements in sorted data',
            'Database lookups',
            'Symbol table implementations'
        ]
    },
    'bst-inorder': {
        name: 'BST - Inorder Traversal',
        complexity: 'O(n)',
        code: `void inorder(TreeNode* root) {
    if (root != nullptr) {
        inorder(root->left);   // Visit left subtree
        cout << root->data << " ";  // Visit root
        inorder(root->right);  // Visit right subtree
    }
}`,
        pros: [
            'Produces sorted sequence',
            'Time complexity O(n)',
            'Simple recursive implementation',
            'Useful for printing sorted data'
        ],
        cons: [
            'Requires O(h) stack space',
            'Not suitable for very large trees',
            'Recursive approach may cause stack overflow'
        ],
        examples: [
            {
                title: 'Example: Inorder Traversal',
                description: 'For BST with root 50, left subtree [20, 30, 40], right subtree [60, 70, 80], inorder gives: 20, 30, 40, 50, 60, 70, 80'
            }
        ],
        useCases: [
            'Printing BST in sorted order',
            'Getting sorted sequence from BST',
            'Validating BST property'
        ]
    },
    'bst-preorder': {
        name: 'BST - Preorder Traversal',
        complexity: 'O(n)',
        code: `void preorder(TreeNode* root) {
    if (root != nullptr) {
        cout << root->data << " ";  // Visit root
        preorder(root->left);   // Visit left subtree
        preorder(root->right);  // Visit right subtree
    }
}`,
        pros: [
            'Useful for copying tree structure',
            'Time complexity O(n)',
            'Simple recursive implementation',
            'Can be used to serialize tree'
        ],
        cons: [
            'Requires O(h) stack space',
            'Does not produce sorted sequence',
            'Recursive approach may cause stack overflow'
        ],
        examples: [
            {
                title: 'Example: Preorder Traversal',
                description: 'For BST with root 50, left subtree [20, 30, 40], right subtree [60, 70, 80], preorder gives: 50, 20, 30, 40, 60, 70, 80'
            }
        ],
        useCases: [
            'Copying tree structure',
            'Tree serialization',
            'Expression tree evaluation'
        ]
    },
    'bst-postorder': {
        name: 'BST - Postorder Traversal',
        complexity: 'O(n)',
        code: `void postorder(TreeNode* root) {
    if (root != nullptr) {
        postorder(root->left);   // Visit left subtree
        postorder(root->right);  // Visit right subtree
        cout << root->data << " ";  // Visit root
    }
}`,
        pros: [
            'Useful for deleting tree',
            'Time complexity O(n)',
            'Simple recursive implementation',
            'Can be used in expression evaluation'
        ],
        cons: [
            'Requires O(h) stack space',
            'Does not produce sorted sequence',
            'Recursive approach may cause stack overflow'
        ],
        examples: [
            {
                title: 'Example: Postorder Traversal',
                description: 'For BST with root 50, left subtree [20, 30, 40], right subtree [60, 70, 80], postorder gives: 20, 30, 40, 60, 70, 80, 50'
            }
        ],
        useCases: [
            'Deleting entire tree',
            'Expression tree evaluation',
            'Calculating tree size'
        ]
    }
};

// Get visualization link for algorithm
function getVisualizationLink(algorithmId) {
    const linkMap = {
        'bubble-sort': 'bubble-sort.html',
        'selection-sort': 'selection-sort.html',
        'insertion-sort': 'insertion-sort.html',
        'linear-search': 'linear-search.html',
        'binary-search': 'binary-search.html',
        'linkedlist-insert-end': 'html/linkedlist-insert-end.html',
        'linkedlist-insert-start': 'html/linkedlist-insert-start.html',
        'linkedlist-insert-position': 'html/linkedlist-insert-position.html',
        'linkedlist-delete': 'html/linkedlist-delete.html',
        'queue-enqueue': 'html/queue-enqueue.html',
        'queue-dequeue': 'html/queue-dequeue.html',
        'queue-front': 'html/queue-front.html',
        'bst-insert': 'html/bst-insert.html',
        'bst-delete': 'html/bst-delete.html',
        'bst-search': 'html/bst-search.html',
        'bst-inorder': 'html/bst-inorder.html',
        'bst-preorder': 'html/bst-preorder.html',
        'bst-postorder': 'html/bst-postorder.html'
    };
    
    return linkMap[algorithmId] || 'bubble-sort.html';
}

// Load algorithm content
window.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const algorithmId = urlParams.get('alg');
    
    if (!algorithmId || !algorithms[algorithmId]) {
        document.getElementById('algorithmContent').innerHTML = `
            <div class="content-section">
                <h2>Algorithm Not Found</h2>
                <p>Please select a valid algorithm from the home page.</p>
                <a href="home.html" class="visualize-btn">Go to Home</a>
            </div>
        `;
        return;
    }

    const algorithm = algorithms[algorithmId];
    const content = document.getElementById('algorithmContent');

    content.innerHTML = `
        <div class="algorithm-header">
            <div class="header-title-section">
                <h1>${algorithm.name}</h1>
                <span class="complexity">Time Complexity: ${algorithm.complexity}</span>
            </div>
            <a href="${getVisualizationLink(algorithmId)}" class="visualize-btn">
                <i class="fas fa-play"></i> Interactive Visualization
            </a>
        </div>

        <div class="content-section">
            <h2>Code Implementation</h2>
            <div class="code-block">
                <pre><code class="language-cpp">${algorithm.code}</code></pre>
            </div>
        </div>

        <div class="content-section">
            <h2>Pros and Cons</h2>
            <div class="pros-cons">
                <div class="pros">
                    <h3>✅ Advantages</h3>
                    <ul>
                        ${algorithm.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons">
                    <h3>❌ Disadvantages</h3>
                    <ul>
                        ${algorithm.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="content-section">
            <h2>Examples</h2>
            <div class="examples">
                ${algorithm.examples.map(example => `
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
                ${algorithm.useCases.map(useCase => `
                    <div class="use-case-item">${useCase}</div>
                `).join('')}
            </div>
        </div>

    `;
});

