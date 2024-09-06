import React, { useState, useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import s from "./index.module.css";

const API_URL = "https://35a5efcf67845dd8.mokky.dev/items";

const TaskManager = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemYear, setItemYear] = useState("");

  // Получение списка элементов при загрузке компонента
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Ошибка при получении данных");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    };

    fetchItems();
  }, []);

  // Функция для добавления нового элемента
  const addItem = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice || !itemYear) return;

    const newItem = { name: itemName, price: itemPrice, year: itemYear };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении элемента");
      }

      const data = await response.json();
      setItems([...items, data]);
      setItemName("");
      setItemPrice("");
      setItemYear("");
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  // Функция для удаления элемента
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении элемента");
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div>
      <form className={s.aside} onSubmit={addItem}>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Название"
        />
        <input
          type="text"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="Цена"
        />
        <input
          type="number"
          value={itemYear}
          onChange={(e) => setItemYear(e.target.value)}
          placeholder="Год"
        />
        <button type="submit">Добавить элемент</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={s.card}>
            <TiDelete
              className={s.deleteIcon}
              onClick={() => deleteItem(item.id)}
            />
            <h3>{item.name}</h3>
            <h4>Цена: {item.price}</h4>
            <p>Год выпуска: {item.year}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
