import React from 'react';

const SelectionTable = ({ items, onItemClick }) => {

  return (
    <div className="d-inline-block border border-3 rounded p-3 mb-5">
      <h3 className="mb-4 text-center">Form Components</h3>
      <ul className='list-unstyled' >
        {items.map((item, index) => (
          <li 
            key={index} 
            className='btn d-flex flex-column align-items-start border rounded m-1'
            onClick={() => onItemClick(item)} // Add onClick handler
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectionTable;
