import React, {useState, useEffect} from 'react';
import { Container, Table } from 'react-bootstrap';

function SavedProgress() {
  // State to hold saved data and selected item id
  const [savedData, setSavedData] = useState([]);



  // Dummy data for saved progress
  useEffect(() => {
    const dummySavedData = [
      { id: 1, title: 'Saved Item 1', description: 'Description for Saved Item 1' },
      { id: 2, title: 'Saved Item 2', description: 'Description for Saved Item 2' },
      { id: 3, title: 'Saved Item 3', description: 'Description for Saved Item 3' },
      // Add more saved items as needed
  ];
  
    // Simulate fetching data from a database using useEffect
        setSavedData(dummySavedData);
      }, []); // Empty dependency array = effect runs only on moount
    
      return (
        <Container>
          <h2 className='text-center'>Saved In Progress</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Form Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {savedData.map(item => (
                <tr key={item.id}>
                  <td>{item.formType}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      );
    }

export default SavedProgress;
