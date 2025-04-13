import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState({});
  const [note, setNote] = useState('');

  const formattedDate = currentDate.toISOString().split('T')[0];

  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const handleAddFood = (mealType, name, calories) => {
    const updated = { ...logs };
    const newEntry = { name, calories, meal: mealType, id: Date.now() };

    if (!updated[formattedDate]) updated[formattedDate] = [];
    updated[formattedDate].push(newEntry);
    setLogs(updated);
  };

  const handleDelete = (entryId) => {
    const updated = { ...logs };
    updated[formattedDate] = updated[formattedDate].filter(entry => entry.id !== entryId);
    setLogs(updated);
  };

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const foodIcons = {
    Breakfast: '🍳',
    Lunch: '🍱',
    Dinner: '🍝',
    Snack: '🍓'
  };

  return (
    <div className="app">
      <h1>welcome to your calorie diary</h1>
      <h2>{formattedDate}</h2>

      <div className="nav-buttons">
        <button onClick={handlePrevDay}>⬅️ </button>
        <button onClick={handleNextDay}> ➡️</button>
      </div>

      {meals.map(meal => (
        <div key={meal} className="meal-section">
          <h3>{foodIcons[meal]} {meal}</h3>
          <FoodForm onAdd={(name, cal) => handleAddFood(meal, name, cal)} />
          <ul>
            {(logs[formattedDate] || []).filter(e => e.meal === meal).map(entry => (
              <li key={entry.id}>
                {entry.name} - {entry.calories} kcal
                <button onClick={() => handleDelete(entry.id)}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="note-section">
        <h3>📝 Notes About Your Day</h3>
        <textarea
          placeholder="Write something nice here... :>"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}

function FoodForm({ onAdd }) {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

  const submit = () => {
    if (food && calories && calories > 0) {
      onAdd(food, parseInt(calories));
      setFood('');
      setCalories('');
    } else {
      alert("we both know ur ass aint eating negative calories");
    }
  };

  return (
    <div className="food-form">
      <input
        type="text"
        placeholder="Food name"
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />
      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <button onClick={submit}>Add</button>
    </div>
  );
}

export default App;