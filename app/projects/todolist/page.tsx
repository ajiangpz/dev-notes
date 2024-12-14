"use client";
import { useEffect, useState } from "react";

type Todo = {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoList() {

    // 状态
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

    // 添加任务
    const addTodo = () => {
        if (newTodo.trim() !== '') {
            const newId = todoList.length + 1;
            const newTodoItem: Todo = { id: newId, text: newTodo, completed: false };
            setTodoList([...todoList, newTodoItem]);
            setNewTodo('');
        }
    }

    // 删除任务
    const deleteTodo = (id: number) => {
        setTodoList(todoList.filter((todo) => todo.id !== id));
    }



    useEffect(() => {
        console.log("useEffect--设置依赖数组",);
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }, [todoList]);

    useEffect(() => {
        console.log("useEffect--不设置第二个参数");
    })
    useEffect(() => {
        console.log("useEffect--设置空的依赖数组");
        const storedTodoList = localStorage.getItem('todoList');
        if (storedTodoList) {
            setTodoList(JSON.parse(storedTodoList));
        }
    }, [])
    return (
        < div className="w-full flex flex-col  w-3/4 mx-auto m-auto mt-10" >
            <input className="border border-gray-300 p-2 mb-4 w-full b-r-10 rounded text-neutral-900 outline-none" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <button onClick={addTodo} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add</button>
            <ul className="mt-4">

                {todoList.map((todo) => {
                    return (

                        <li key={todo.id} className="flex items-center justify-between mb-2">
                            <input className="mr-2 flex-none text-neutral-900" type="checkbox" checked={todo.completed} onChange={() => { setTodoList(todoList.map((t) => t.id === todo.id ? { ...t, completed: !t.completed } : t)) }} />
                            <span className={'text-gray-600 align-self-start flex-1  overflow-hidden text-ellipsis ' + (todo.completed ? ' line-through' : '')}   >{todo.text}</span>

                            <button className="flex-none bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded" onClick={() => deleteTodo(todo.id)} >Delete</button>
                        </li>
                    )
                })}
            </ul>
        </div >
    )

}