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
			 <button class="todo-edit"></button>
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
		this.todoData.forEach((item) => {		
			if (item.key === elem.key) {
				this.deleteAnim(elem);
				this.todoData.delete(item.key);
				this.addToStorage();
			}
		});
	}
	// анимация удаления
	deleteAnim(elem) {
		let count = 0;
		function fly() {
			requestAnimationFrame(fly);
			count +=4;
			if(count <= 120) elem.style.transform = 'translateX(' + count + '%)';
			if (count === 120) elem.remove();
			}
		fly();
	}
	// заверешенные дела
	completedItem(elem) {		
		// анимация 
		let counter = 0;
		elem.style.opacity = 0;
		function animate() {			
			requestAnimationFrame(animate);
			counter += 0.05;
			if (counter <= 1) {
				elem.style.opacity = counter;
			}
		}
		
		this.todoData.forEach(item => {
			if (item.key === elem.key) {
				item.completed = !item.completed;
				this.addToStorage();
				if (item.completed === true) {
					elem.remove();
					this.todoCompleted.append(elem);
					animate();
				} else {
					elem.remove();
					this.todoList.append(elem);
					animate();
				}
			}
		});
		
	}
	editTodo(elem) {	
		elem.setAttribute('contenteditable', 'true');
		elem.focus();
		elem.addEventListener('keypress', event => {
			if (event.key === 'Enter') {
				elem.setAttribute('contenteditable', 'false');
				elem.blur();
			}
		})
	}

	handler() {
		const todoItem = document.querySelectorAll('.todo-item');
		todoItem.forEach( item => {
			item.addEventListener('click', event => {
				const btn = event.target.closest('button');
				const btnClass = btn.className;
				if ( btnClass === 'todo-remove') this.deleteItem(item);
				if ( btnClass === 'todo-complete') this.completedItem(item);
				if ( btnClass === 'todo-edit') this.editTodo(item);
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