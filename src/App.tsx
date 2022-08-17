import "./App.css";
import create from "zustand";
import shallow from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface Todo {
  id: string;
  text: string;
}

interface TodoStore {
  todo: Todo;
  todos: Todo[];
  setLocalTodo: (todo: Todo) => void;
  addTodo: (Todo: Todo) => void;
  editTodo: (Todo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todo: { id: "", text: "" },
  todos: [],
  setLocalTodo: (todo: Todo) => set((state) => ({ ...state, todo })),
  addTodo: (todo: Todo) =>
    set((state) => ({ ...state, todos: [...state.todos, todo] })),
  editTodo: (todo: Todo) =>
    set((state) => ({
      ...state,
      todos: state.todos.map((t: Todo) => (t.id === todo.id ? todo : t)),
    })),
  deleteTodo: (id: string) =>
    set((state) => ({
      ...state,
      todos: state.todos.filter((t: Todo) => t.id !== id),
    })),
}));

mountStoreDevtool("todoStore", useTodoStore);

function App() {
  const [todo, todos, setLocalTodo, addTodo, editTodo, deleteTodo] =
    useTodoStore(
      (state) => [
        state.todo,
        state.todos,
        state.setLocalTodo,
        state.addTodo,
        state.editTodo,
        state.deleteTodo,
      ],
      shallow
    );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (todo.id.length > 0) editTodo(todo);
    else addTodo({ id: uuidv4(), text: todo.text });

    setLocalTodo({ id: "", text: "" });
  };

  return (
    <div className="App">
      <h1>Learning Zustand</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo.text}
          onChange={(e) => setLocalTodo({ id: todo.id, text: e.target.value })}
          required
          placeholder="Add Todo"
        />
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span onClick={() => setLocalTodo(todo)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
