import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './todo.css';

function Todos() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [todos, setTodos] = useState([]); // Dùng useState để lưu todos
    const inputRef = useRef();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            // Fetch todos cho người dùng từ API dựa trên userId
            fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/todos`)
                .then(response => response.json())
                .then(data => {
                    setTodos(data); // Lưu todos vào state
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching todos:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate("/login");
        }
    }, []); // Mảng dependency chứa 'user' để rerun useEffect khi thông tin user thay đổi

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = e.target.elements.inputTodo.value;
        if (value) {
            // Gửi yêu cầu POST để tạo mới một todo
            fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify({
                    title: value,
                    userId: user.id, // Sử dụng userId từ localStorage
                    completed: false
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.json())
            .then(data => {
                // Cập nhật dữ liệu todo mới vào state sau khi tạo
                const newTodo = {
                    id: Date.now(),  // Giả lập ID cho todo mới
                    title: value,
                    completed: false,
                };
                setTodos(prevTodos => [...prevTodos, newTodo]); // Thêm todo vào mảng todos
                inputRef.current.value = "";  // Clear input
            })
            .catch(err => console.error("Error creating todo:", err));
        }
    };

    const handleCheckboxChange = (id, checked) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: checked } : todo
        );
        setTodos(updatedTodos); // Update local state with the new todo list
    
        // Send the PATCH request to update the 'completed' status on the server
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            completed: checked, // Update completed status in the request
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
          .then((json) => {
            console.log(json); // Log the updated todo object
          })
          .catch((error) => console.error("Error updating todo:", error));
      };

    const handleDelete = (id) => {
        // Gửi yêu cầu DELETE để xóa todo từ API
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            // Cập nhật state sau khi xóa todo
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // Xóa todo khỏi state
        })
        .catch(err => console.error("Error deleting todo:", err));
    };

    return (
        <div className="todos-container">
            <form className="todos-form" onSubmit={handleSubmit}>
                <input ref={inputRef} name="inputTodo" />
                <button>Add todo</button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="todos-list">
                    {todos.map(item => (
                        <li key={item.id}>
                            <button onClick={() => handleDelete(item.id)}>X</button>
                            <span>{item.title}</span>
                            <label>
                <input
                  type="checkbox"
                  checked={todos.completed} 
                  onChange={(e) =>
                    handleCheckboxChange(todos.id, e.target.checked) 
                  }
                />
                {todos.title}
              </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Todos;
