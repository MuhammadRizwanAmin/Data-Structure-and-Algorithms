// Check if user is logged in
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display user name in header
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        el.textContent = `Welcome, ${currentUser.name}`;
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Algorithms data
    const algorithms = [
        {
            id: 'bubble-sort',
            name: 'Bubble Sort',
            description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
            complexity: 'O(n²)',
            category: 'Sorting'
        },
        {
            id: 'selection-sort',
            name: 'Selection Sort',
            description: 'An in-place comparison sorting algorithm that divides the input list into two parts: sorted and unsorted.',
            complexity: 'O(n²)',
            category: 'Sorting'
        },
        {
            id: 'insertion-sort',
            name: 'Insertion Sort',
            description: 'A simple sorting algorithm that builds the final sorted array one item at a time, similar to how you sort playing cards.',
            complexity: 'O(n²)',
            category: 'Sorting'
        },
        {
            id: 'linear-search',
            name: 'Linear Search',
            description: 'A simple search algorithm that checks each element in the array sequentially until the target element is found or the array ends.',
            complexity: 'O(n)',
            category: 'Searching'
        },
        {
            id: 'binary-search',
            name: 'Binary Search',
            description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
            complexity: 'O(log n)',
            category: 'Searching'
        },
        {
            id: 'linkedlist-insert-end',
            name: 'Linked List - Insert at End',
            description: 'Add a new node at the end of the linked list by traversing to the last node.',
            complexity: 'O(n)',
            category: 'Linked List'
        },
        {
            id: 'linkedlist-insert-start',
            name: 'Linked List - Insert at Start',
            description: 'Add a new node at the beginning of the linked list by updating the head pointer.',
            complexity: 'O(1)',
            category: 'Linked List'
        },
        {
            id: 'linkedlist-insert-position',
            name: 'Linked List - Insert at Position',
            description: 'Insert a new node at a specific position in the linked list.',
            complexity: 'O(n)',
            category: 'Linked List'
        },
        {
            id: 'linkedlist-delete',
            name: 'Linked List - Delete Node',
            description: 'Delete a node with a given value from the linked list.',
            complexity: 'O(n)',
            category: 'Linked List'
        },
        {
            id: 'queue-enqueue',
            name: 'Queue - Enqueue',
            description: 'Add an element to the rear of the queue following FIFO principle.',
            complexity: 'O(1)',
            category: 'Queue'
        },
        {
            id: 'queue-dequeue',
            name: 'Queue - Dequeue',
            description: 'Remove an element from the front of the queue following FIFO principle.',
            complexity: 'O(1)',
            category: 'Queue'
        },
        {
            id: 'queue-front',
            name: 'Queue - Front/Peek',
            description: 'View the front element of the queue without removing it.',
            complexity: 'O(1)',
            category: 'Queue'
        }
    ];

    // Data Structures data
    const dataStructures = [
        {
            id: 'linkedlist',
            name: 'Linked List',
            description: 'A linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.',
            category: 'Linear'
        },
        {
            id: 'queue',
            name: 'Queue',
            description: 'A linear data structure that follows FIFO (First In First Out) principle, where elements are added at the rear and removed from the front.',
            category: 'Linear'
        }
    ];

    const algorithmsGrid = document.getElementById('algorithmsGrid');
    const dataStructuresGrid = document.getElementById('dataStructuresGrid');
    const searchInput = document.getElementById('searchInput');

    // Render algorithms
    function renderAlgorithms(algorithmsToRender) {
        if (algorithmsToRender.length === 0) {
            algorithmsGrid.innerHTML = '<div class="no-results">No algorithms found matching your search.</div>';
            return;
        }

        algorithmsGrid.innerHTML = algorithmsToRender.map(alg => `
            <div class="algorithm-card" onclick="window.location.href='algorithm.html?alg=${alg.id}'">
                <h3>${alg.name}</h3>
                <p>${alg.description}</p>
                <div>
                    <span class="badge">${alg.complexity}</span>
                    <span class="badge">${alg.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Render data structures
    function renderDataStructures(dataStructuresToRender) {
        if (dataStructuresToRender.length === 0) {
            dataStructuresGrid.innerHTML = '<div class="no-results">No data structures found matching your search.</div>';
            return;
        }

        dataStructuresGrid.innerHTML = dataStructuresToRender.map(ds => `
            <div class="algorithm-card" onclick="window.location.href='data-structure.html?ds=${ds.id}'">
                <h3>${ds.name}</h3>
                <p>${ds.description}</p>
                <div>
                    <span class="badge">${ds.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Initial render
    renderAlgorithms(algorithms);
    renderDataStructures(dataStructures);

    // Search functionality - search both algorithms and data structures
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredAlgorithms = algorithms.filter(alg => 
            alg.name.toLowerCase().includes(searchTerm) ||
            alg.description.toLowerCase().includes(searchTerm)
        );
        const filteredDataStructures = dataStructures.filter(ds => 
            ds.name.toLowerCase().includes(searchTerm) ||
            ds.description.toLowerCase().includes(searchTerm)
        );
        renderAlgorithms(filteredAlgorithms);
        renderDataStructures(filteredDataStructures);
    });
});

