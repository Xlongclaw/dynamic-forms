"use client";

import { useState } from "react";

export default function DraggableList() {
  const [items, setItems] = useState([
    { itemName: "Item 1", sequence: 1 },
    { itemName: "Item 2", sequence: 2 },
    { itemName: "Item 3", sequence: 3 },
    { itemName: "Item 4", sequence: 4 },
  ]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];
      newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);

      // Update the sequence based on the new order
      const updatedItems = newItems.map((item, i) => ({ ...item, sequence: i + 1 }));
      setItems(updatedItems);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <ul className="w-80 p-4 bg-gray-100 rounded-lg shadow-md">
      {items
        .sort((a, b) => a.sequence - b.sequence) // Sorting based on sequence
        .map((item, index) => (
          <li
            key={item.sequence}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={handleDragEnd}
            className={`p-3 my-2 bg-white rounded-md shadow cursor-pointer transition-all ${
              draggedIndex === index ? "opacity-50 scale-105 shadow-lg" : ""
            }`}
          >
            {item.itemName}
          </li>
        ))}
    </ul>
  );
}
