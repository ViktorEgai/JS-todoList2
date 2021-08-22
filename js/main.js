/* eslint-disable indent */
class ToDo {
	constructor(form, input, todoList, todoCompleted) {
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
	}

	addToStorage() {
		localStorage.setItem('todoList',JSON.stringify([...this.todoData]))
	}

	render() {
		this.todoList.textContent = '';		
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem.bind(this));
		this.addToStorage();
		this.handler();
	}

	createItem(todo) {
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.key = todo.key;		
		li.insertAdjacentHTML('beforeend', `
		<span class="text-todo">${todo.value}</span>
       <div class="todo-buttons">
			 <button class="todo-remove"></button>
			 <button class="todo-complete"></button>
			 </div>
		`);
		if (todo.completed) {
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
	}

	addTodo(event) {
		event.preventDefault();
		
		if (this.input.value === '') {
			alert('Пустую строку добавить нельзя');
		} else {
			if (this.input.value.trim()) {
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey()
			};
			this.input.value = '';
			this.todoData.set(newTodo.key, newTodo);
			this.render();
		} 
		}
	}

	deleteItem(elem) {
		const li = elem.parentNode.parentNode;
		this.todoData.forEach((item) => {		
			if (item.key === li.key) {
				li.remove();
				this.todoData.delete(item.key);
				this.addToStorage();
			}
		});
	}
	deleteAnimation() {
		
	}
	completedItem(elem) {
		const li = elem.parentNode.parentNode;
		this.todoData.forEach(item => {
			if (item.key === li.key) {
				item.completed = !item.completed;
				this.addToStorage();
				if (item.completed === true) {
					li.remove();
					this.todoCompleted.append(li)
				} else {
					li.remove();
					this.todoList.append(li)
				}
			}
		});
	}

	handler() {
		const todoItem = document.querySelectorAll('.todo-item');
		todoItem.forEach( item => {
			item.addEventListener('click', event => {
				const btn = event.target.closest('button');
				const btnClass = btn.className;
				if ( btnClass === 'todo-remove') this.deleteItem(btn);
				if ( btnClass === 'todo-complete') this.completedItem(btn);
			});
		});
		}


	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	init() {
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
	}
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();