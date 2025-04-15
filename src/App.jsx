import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState({});
  const [note, setNote] = useState('');
  const [unsavedFood, setUnsavedFood] = useState({});

  const formattedDate = currentDate.toISOString().split('T')[0];

  const handlePrevDay = () => {
    if (hasUnsavedInput()) {
      alert("Please submit or clear your current food input before changing the date! >:3");
      return;
    }
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  const handleNextDay = () => {
    if (hasUnsavedInput()) {
      alert("Please submit or clear your current food input before changing the date! >:3");
      return;
    }
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const handleAddFood = (mealType, name, calories) => {
    const updated = { ...logs };
    const newEntry = { name, calories, meal: mealType, id: Date.now() };

    if (!updated[formattedDate]) updated[formattedDate] = [];
    updated[formattedDate].push(newEntry);
    setLogs(updated);
    setUnsavedFood(prev => ({ ...prev, [mealType]: { food: '', cal: '' } }));
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

  const hasUnsavedInput = () => {
    return Object.values(unsavedFood).some(entry => entry?.food || entry?.cal);
  };

  return (
    <div className="app">
      <h1>Welcome to Kcal Counter >:3</h1>
      <h2>{formattedDate}</h2>

      <div className="nav-buttons">
        <button onClick={handlePrevDay}>⬅️</button>
        <button onClick={handleNextDay}>➡️</button>
      </div>

      {meals.map(meal => (
        <div key={meal} className="meal-section">
          <h3>{foodIcons[meal]} {meal}</h3>
          <FoodForm
            meal={meal}
            onAdd={(name, cal) => handleAddFood(meal, name, cal)}
            unsaved={unsavedFood[meal]}
            setUnsaved={setUnsavedFood}
          />
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

function FoodForm({ meal, onAdd, unsaved, setUnsaved }) {
  const food = unsaved?.food || '';
  const calories = unsaved?.cal || '';

  const updateUnsaved = (field, value) => {
    setUnsaved(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value
      }
    }));
  };

  const submit = () => {
    if (!food.trim()) {
      alert("no food? uh oh :<");
      return;
    }
    const calValue = parseInt(calories);
    if (isNaN(calValue) || calValue < 0) {
      alert("we both know ur ass aint getting negative calories");
      return;
    }
    onAdd(food, calValue);
  };

  return (
    <div className="food-form">
      <input
        type="text"
        placeholder="Food name"
        value={food}
        onChange={(e) => updateUnsaved('food', e.target.value)}
      />
      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => updateUnsaved('cal', e.target.value)}
      />
      <button onClick={submit}>Add</button>
    </div>
  );
}

export default App;
