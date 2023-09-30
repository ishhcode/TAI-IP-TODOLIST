
import React, { useEffect, useState } from "react";
import List from "./list";
import Alert from "./alert";
import todoimg from "../images/todo-img.jpg";


const getLocalStorage = ()=>{
    let list = localStorage.getItem("list");
    if(list){
        return ( list = JSON.parse(localStorage.getItem("list")));
    }
    else{
        return [];
    }
}

export default function Todo() {
    const [name, setName] = useState("");
    const [list, setList] = useState(getLocalStorage());
    const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
    

    useEffect(() =>{
        localStorage.setItem("list", JSON.stringify(list));
    },[list]);

    const handleSubmit= (e)=>{
        e.preventDefault();
        if(!name){
            showAlert(true,"danger", "Please Enter Value");
        }
        else if(name && isEditing){
            setList(
                list.map((item) =>{
                    if(item.id === editID){
                        return {...item,title: name};
                    }
                    return item;
                })
            );
            setName("");
            setEditID(null);
            setIsEditing(false);
            showAlert(true,"success","Value Changed");
        }
        else{
            showAlert(true,"success","Item Added to the List");
            const newItem ={ id: new Date().getTime().toString(), title: name};
            setList([...list, newItem]);
            setName("");
        }
    };
    const showAlert = (show=false, msg="", type="")=>{
        setAlert({show, type, msg});
    };
    const removeItem = (id)=>{
        showAlert(true,"danger","Item Removed");
        setList(list.filter((item) => item.id !== id));
    };
    const editItem = (id)=>{
        const editItem = list.find((item) => item.id ===id);
        setIsEditing(true);
        setEditID(id);
        setName(editItem.title);
    };
    const clearList =()=>{
        setAlert(true,"danger","Empty List");
        setList([]);
    };

    return (
        <section className="section-center">
            <form onSubmit={handleSubmit}>
                {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
                <div className="heading">
                    <figure>
                        <img alt="todologo" src={todoimg} className="todologo" />
                        <figcaption className="todocaption">Add Your List Here✌️</figcaption>
                    </figure>
                </div>
                <div className="mb-3 form">
                    <input type="text"
                        className="form-control"
                        placeholder="✍️ Add Items..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-success">
                        {isEditing? "Edit" :"Submit"}
                    </button>
                </div>
            </form>
            {list.length >0 && (
                <div style={{ marginTop: "2rem"}}>
                    <List items={list} removeItem={removeItem} editItem={editItem} />
                    <div className="text-center">
                        <button className="btn btn-warning" onClick={clearList}>
                            Clear Items
                        </button>
                    </div>
                </div>
            )}
        </section>

    )
};

