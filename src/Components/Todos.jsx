import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Todos(){
    const [todos, setTodos] = useState('');
    const [id,setId] = useState();

    useEffect(()=>{
        handleSubmit();
    },[])
    
    const handleSubmit = async ()=>{
        if(id){
            const req = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
            const res = await req.json();
            console.log(res);
            setTodos(res);
        }
    }

    return (
        <>
            <input type="text" name="todo" id="todo" onChange={(e)=> setId(e.target.value)}/>
            <button type="button" onClick={handleSubmit}>Get</button>
            {
                todos && <>
                    Title : {todos.title}
                </>
            }
        </>
    )
}

export default Todos;