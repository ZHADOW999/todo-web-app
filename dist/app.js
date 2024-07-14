var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
} else {
    themeToggleDarkIcon.classList.remove('hidden');
}

var themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function() {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
    
});

// Get the elements
const todoInput = document.getElementById('text-input');
const todoList = document.querySelector('ul');
const emptyListElement = document.createElement('li');
emptyListElement.textContent = 'No todos left';

// Function to update the todo count
function updateTodoCount() {
    const todos = todoList.querySelectorAll('.todo-item');
    const visibleTodos = Array.from(todos).filter(todo => todo.style.display !== 'none');
    const count = visibleTodos.length;
    document.getElementById('todo-count').textContent = `${count} item${count !== 1 ? 's' : ''} left`;
}

// Function to make todo items draggable
function makeTodoItemsDraggable() {
    const todos = document.querySelectorAll('.todo-item');
    todos.forEach(todo => {
        todo.setAttribute('draggable', 'true');
        todo.addEventListener('dragstart', () => {
            todo.classList.add('dragging');
        });
        todo.addEventListener('dragend', () => {
            todo.classList.remove('dragging');
            saveTodosToLocalStorage();
        });
    });

    todoList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(todoList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            todoList.appendChild(dragging);
        } else {
            todoList.insertBefore(dragging, afterElement);
        }
    });
}

// Helper function to determine where to place the dragged item
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Event listener for adding a new todo item
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (todoInput.value.trim() === "") {
            alert("Please enter a task to add to your list");
            return;
        }

        // Create a new todo item
        const newTodo = document.createElement('li');
        newTodo.className = 'todo-item text-center h-14 justify-between flex items-center px-4 border-b-[1px] border-LightGrayishBlue ';
        newTodo.innerHTML = `
            <div class="flex gap-5 items-center">
                <input type="checkbox" class="checkbox2 hidden">
                <div class="rounded-full p-[0.5px] hover:bg-gradient-to-tl hover:from-CheckBackground_T hover:to-checkBackground_B"><label class="check2 w-6 h-6 cursor-pointer bg-VeryLightGray dark:bg-VeryDarkDesaturatedBlue z-20  border-[1px] flex items-center justify-center rounded-full"><img src="./images/icon-check.svg" class="checkImg2 hidden "></label></div>
                <span class="todo-text text-VeryDarkGrayishBlue dark:text-LightGrayishBlueHover">${todoInput.value}</span>
            </div>
            <button class="delete-btn"><img src="./images/icon-cross.svg" alt="delete button"></button>
        `;

        // Add the new todo item to the list
        todoList.appendChild(newTodo);

        // Clear the input field
        todoInput.value = '';

        // Re-apply current filter
        const activeFilter = document.querySelector('.filter-btn.active').id;
        filterTodos(activeFilter.replace('filter-', ''));
        updateTodoCount(); // Update count after addition

        // Add event listeners to the new elements
        setupTodoItemListeners(newTodo);
        makeTodoItemsDraggable(); // Make new items draggable
        saveTodosToLocalStorage(); // Save to local storage
    }
});

// Setup event listeners for checkboxes and delete buttons
function setupTodoItemListeners(todoItem) {
    const checkbox = todoItem.querySelector('.checkbox2');
    const check2 = todoItem.querySelector('.check2');
    const checkImg2 = todoItem.querySelector('.checkImg2')
    const todoText = todoItem.querySelector('.todo-text');
    const deleteBtn = todoItem.querySelector('.delete-btn');

    // Label click event listener
    check2.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked; // Toggle checkbox state
        if (checkbox.checked) {
            check2.classList.add('bg-gradient-to-tl', 'from-CheckBackground_T', 'to-checkBackground_B');
            todoText.classList.add('line-through','text-LightGrayishBlue','dark:text-VeryDarkGrayishBlue');
            todoText.classList.remove('dark:text-LightGrayishBlueHover','text-VeryDarkGrayishBlue')
            checkImg2.classList.remove('hidden');
        } else {
            check2.classList.remove('bg-gradient-to-tl', 'from-CheckBackground_T', 'to-checkBackground_B');
            todoText.classList.add('dark:text-LightGrayishBlueHover')
            todoText.classList.remove('line-through','text-LightGrayishBlue','dark:text-VeryDarkGrayishBlue');
            checkImg2.classList.add('hidden');
        }
        updateTodoCount(); // Update count on checkbox change
        saveTodosToLocalStorage(); // Save to local storage
    });

    // Delete button event listener
    deleteBtn.addEventListener('click', () => {
        todoItem.remove();
        updateTodoCount(); // Update count after deletion
        saveTodosToLocalStorage(); // Save to local storage

        // Check if the list is empty
        if (todoList.children.length === 0) {
            todoList.appendChild(emptyListElement);
        }

        // Re-apply current filter
        const activeFilter = document.querySelector('.filter-btn.active').id;
        filterTodos(activeFilter.replace('filter-', ''));
    });
}

// Clear Completed button event listener
const clearCompletedBtn = document.getElementById('clear-completed');
clearCompletedBtn.addEventListener('click', () => {
    const todos = todoList.querySelectorAll('.todo-item');
    todos.forEach(todo => {
        const checkbox = todo.querySelector('.checkbox2');
        if (checkbox.checked) {
            todo.remove();
        }
    });
    updateTodoCount(); // Update count after deletion
    saveTodosToLocalStorage(); // Save to local storage

    // Check if the list is empty
    if (todoList.children.length === 0) {
        todoList.appendChild(emptyListElement);
    }

    // Re-apply current filter
    const activeFilter = document.querySelector('.filter-btn.active').id;
    filterTodos(activeFilter.replace('filter-', ''));
});

// Filter functionality (unchanged)
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

function addFilterListeners(filterBtn, filter) {
    filterBtn.addEventListener('click', () => filterTodos(filter));
    filterBtn.addEventListener('touchend', () => filterTodos(filter));
}

addFilterListeners(filterAll, 'all');
addFilterListeners(filterActive, 'active');
addFilterListeners(filterCompleted, 'completed');

function filterTodos(filter) {
    const todos = todoList.querySelectorAll('.todo-item');
    const noActiveTodos = document.getElementById('no-active-todos');
    const allTodos = document.getElementById('all-todos');
    const noCompletedTodos = document.getElementById('no-completed-todos');
    let hasActiveTodos = false;
    let hasCompletedTodos = false;
    let hasTodos = false;

    todos.forEach(todo => {
        const checkbox = todo.querySelector('.checkbox2');
        if (filter === 'all') {
            todo.style.display = 'flex';
            hasTodos = true;
        } else if (filter === 'active' && !checkbox.checked) {
            todo.style.display = 'flex';
            hasActiveTodos = true;
        } else if (filter === 'completed' && checkbox.checked) {
            todo.style.display = 'flex';
            hasCompletedTodos = true;
        } else {
            todo.style.display = 'none';
        }
    });

    // Display or hide the "List is empty" message
    if (filter === 'all') {
        allTodos.style.display = hasTodos ? 'none' : 'flex';
        noActiveTodos.style.display = 'none';
        noCompletedTodos.style.display = 'none';
        emptyListElement.style.display = 'none';
    } else if (filter === 'active') {
        noActiveTodos.style.display = hasActiveTodos ? 'none' : 'flex';
        noCompletedTodos.style.display = 'none';
        allTodos.style.display = 'none';
        emptyListElement.style.display = 'none';
    } else if (filter === 'completed') {
        noCompletedTodos.style.display = hasCompletedTodos ? 'none' : 'flex';
        noActiveTodos.style.display = 'none';
        allTodos.style.display = 'none';
        emptyListElement.style.display = 'none';
    }

    // Update active filter button style
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (filter === 'all') {
        filterAll.classList.add('active', 'text-blue','dark:text-blue');
        filterActive.classList.remove('text-blue','dark:text-blue');
        filterCompleted.classList.remove('text-blue','dark:text-blue');
    } else if (filter === 'active') {
        filterActive.classList.add('active', 'text-blue','dark:text-blue');
        filterAll.classList.remove('text-blue','dark:text-blue');
        filterCompleted.classList.remove('text-blue','dark:text-blue');
    } else if (filter === 'completed') {
        filterCompleted.classList.add('active', 'text-blue','dark:text-blue');
        filterAll.classList.remove('text-blue','dark:text-blue');
        filterActive.classList.remove('text-blue','dark:text-blue');
    }
}

const filterAllMd = document.getElementById('filter-all-md');
const filterActiveMd = document.getElementById('filter-active-md');
const filterCompletedMd = document.getElementById('filter-completed-md');

function addFilterListeners2(filterBtn2, filter2) {
    filterBtn2.addEventListener('click', () => filterTodos2(filter2));
    filterBtn2.addEventListener('touchend', () => filterTodos2(filter2));
}

addFilterListeners2(filterAllMd, 'all');
addFilterListeners2(filterActiveMd, 'active');
addFilterListeners2(filterCompletedMd, 'completed');

function filterTodos2(filter2) {
    const todos2 = todoList.querySelectorAll('.todo-item');
    const noActiveTodos2 = document.getElementById('no-active-todos');
    const allTodos2 = document.getElementById('all-todos');
    const noCompletedTodos2 = document.getElementById('no-completed-todos');
    let hasActiveTodos2 = false;
    let hasCompletedTodos2 = false;
    let hasTodos2 = false;

    todos2.forEach(todo2 => {
        const checkbox2 = todo2.querySelector('.checkbox2');
        if (filter2 === 'all') {
            todo2.style.display = 'flex';
            hasTodos2 = true;
        } else if (filter2 === 'active' && !checkbox2.checked) {
            todo2.style.display = 'flex';
            hasActiveTodos2 = true;
        } else if (filter2 === 'completed' && checkbox2.checked) {
            todo2.style.display = 'flex';
            hasCompletedTodos2 = true;
        } else {
            todo2.style.display = 'none';
        }
    });

    // Display or hide the "List is empty" message
    if (filter2 === 'all') {
        allTodos2.style.display = hasTodos2 ? 'none' : 'flex';
        noActiveTodos2.style.display = 'none';
        noCompletedTodos2.style.display = 'none';
        emptyListElement.style.display = 'none';
    } else if (filter2 === 'active') {
        noActiveTodos2.style.display = hasActiveTodos2 ? 'none' : 'flex';
        noCompletedTodos2.style.display = 'none';
        allTodos2.style.display = 'none';
        emptyListElement.style.display = 'none';
    } else if (filter2 === 'completed') {
        noCompletedTodos2.style.display = hasCompletedTodos2 ? 'none' : 'flex';
        noActiveTodos2.style.display = 'none';
        allTodos2.style.display = 'none';
        emptyListElement.style.display = 'none';
    }

    // Update active filter button style
    document.querySelectorAll('.filter-btn2').forEach(btn2 => btn2.classList.remove('active2'));
    if (filter2 === 'all') {
        filterAllMd.classList.add('active2', 'text-blue','dark:text-blue');
        filterActiveMd.classList.remove('text-blue','dark:text-blue');
        filterCompletedMd.classList.remove('text-blue','dark:text-blue');
    } else if (filter2 === 'active') {
        filterActiveMd.classList.add('active2', 'text-blue','dark:text-blue');
        filterAllMd.classList.remove('text-blue','dark:text-blue');
        filterCompletedMd.classList.remove('text-blue','dark:text-blue');
    } else if (filter2 === 'completed') {
        filterCompletedMd.classList.add('active2', 'text-blue','dark:text-blue');
        filterAllMd.classList.remove('text-blue','dark:text-blue');
        filterActiveMd.classList.remove('text-blue','dark:text-blue');
    }
}

// Function to save todos to local storage
function saveTodosToLocalStorage() {
    const todos = [];
    todoList.querySelectorAll('.todo-item').forEach(todo => {
        const todoText = todo.querySelector('.todo-text').textContent;
        const isChecked = todo.querySelector('.checkbox2').checked;
        todos.push({ text: todoText, checked: isChecked });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to load todos from local storage
function loadTodosFromLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    if (todos) {
        todos.forEach(todo => {
            const newTodo = document.createElement('li');
            newTodo.className = 'todo-item text-center h-14 justify-between flex items-center px-4 border-b-[1px] border-LightGrayishBlue ';
            newTodo.innerHTML = `
                <div class="flex gap-5 items-center">
                    <input type="checkbox" class="checkbox2 hidden" ${todo.checked ? 'checked' : ''}>
                    <div class="rounded-full p-[0.5px] hover:bg-gradient-to-tl hover:from-CheckBackground_T hover:to-checkBackground_B"><label class="check2 w-6 h-6 cursor-pointer bg-VeryLightGray dark:bg-VeryDarkDesaturatedBlue z-20  border-[1px] flex items-center justify-center rounded-full"><img src="./images/icon-check.svg" class="checkImg2 ${todo.checked ? '' : 'hidden'} "></label></div>
                    <span class="todo-text ${todo.checked ? 'line-through text-LightGrayishBlue dark:text-VeryDarkGrayishBlue' : 'text-VeryDarkGrayishBlue dark:text-LightGrayishBlueHover'}">${todo.text}</span>
                </div>
                <button class="delete-btn"><img src="./images/icon-cross.svg" alt="delete button"></button>
            `;
            todoList.appendChild(newTodo);
            setupTodoItemListeners(newTodo);
        });
        updateTodoCount();
    }
}

// Function to initialize the count on page load
function initializeTodoCount() {
    updateTodoCount();
}

// Call the initialize function when the page loads
window.addEventListener('load', () => {
    loadTodosFromLocalStorage(); // Load todos from local storage
    initializeTodoCount();
    makeTodoItemsDraggable(); // Make existing items draggable on load
});
