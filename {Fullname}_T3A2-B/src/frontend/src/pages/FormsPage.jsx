import React, { useState, useEffect, useContext } from "react";
import { Table, Button } from "antd";
import { Modal } from "react-bootstrap";
import { ApiContext } from "../contexts/ApiProvider";
import FillOutForm from "../components/FillOutForm";
import Cookies from "js-cookie";
import moment from 'moment'
import {useNavigate, useParams} from 'react-router-dom'
import FavouritesCheckBox from "../components/FavouritesCheckBox";


export default function FormPage() {
  //Cookies
  const jwt = Cookies.get('jwt')
  const auth = Cookies.get('auth')
  //router
  const navigate = useNavigate()
  const { fav } = useParams()
  //contexts
  const { apiUrl } = useContext(ApiContext);
  //useParams
  //useStates
  const [formTemplates, setFormTemplates] = useState([]);
  const [selectedForm, setSelectedForm] = useState(fav || null);
  const [formDescription, setFormDescription] = useState("");
  const [creatingForm, setCreatingForm] = useState(false); // New state
  const [userForms, setUserForms] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete confirmation modal visibility
  const [deleteClicked, setDeleteClicked] = useState(false);



  //API call functions
  const fetchUserForms = async (formId) => {
      try {
        const response = await fetch(`${apiUrl}/forms/currentUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'jwt': jwt,
            'formid': formId
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch form data');
        }
        const data = await response.json();
        setUserForms(data.result)
        console.log(data)
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
  }

  const fetchFormTemplates = async () => {
    try {
      const response = await fetch(`${apiUrl}/formTemplates/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch form template data');
      }
      const data = await response.json();
      setFormTemplates(data.result);
    } catch (error) {
      console.error("Error fetching form template data:", error);
    }
  };

  //useEffects
  useEffect(() => {
    
    fetchFormTemplates()
    //fetchSelectedFormName()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //handles
  const handleFormTemplateSelect = (record) => {
    navigate(`/forms/${record.formName}`)
    setSelectedForm(record.formName);
    setDeleteClicked(false);  
    setCreatingForm(false);
    setFormDescription(""); 
    fetchUserForms(record._id)
  }

  const handleDescriptionChange = (e) => {
    setFormDescription(e.target.value);
  };

  const handleCreateForm = () => {
    if (formDescription.trim() !== "") { // Check if form description is not empty
      setCreatingForm(true); // Set creatingForm state to true
      console.log(formTemplates, selectedForm)
    } else {
      alert("Please enter a form description.");
    }
  };

  const handleFormRowSelect = (record) => {
    const id = record._id
    navigate(`/actions/${id}`)
  }

  const handleOpenDeleteModal = () => {
    setDeleteModalVisible(true);
  }
  

  const handleCloseDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    
    try {
      const response = await fetch(`${apiUrl}/formTemplates/${selectedForm}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete form template');
      }
      const data = await response.json();
      console.log(data.message);
      setDeleteModalVisible(false)
      setSelectedForm(null)
      fetchFormTemplates();
    } catch (error) {
      console.error("Error deleting form template:", error);
    }
  };
  


  //table render formats
  const selectionColumns = [
    {
      title: "Available Forms",
      dataIndex: "formName",
      key: "formName",
    },
  ];

  const formColumns = [
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description' 
    },
    {
      title: 'submission date/time',
      dataIndex: 'timeStamp',
      key: 'timeStamp',
      render: (timeStamp) => moment(timeStamp).format('DD-MM-YYYY / hA')
    },
    {
      title: 'submitted by',
      dataIndex: 'user',
      key: 'user',
      className: 'd-none d-sm-table-cell',
      render: (user) => {
        return `${user.fname} ${user.lname}`
      }
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'assigned',
      dataIndex: 'formTemplate',
      key: 'formTemplate',
      className: 'd-none d-sm-table-cell',
      render: (formTemplate) => {
        return formTemplate.assignedTo.fname
      }
    },
    {
      title: 'tasked user',
      dataIndex: 'taskedUser',
      key: 'taskedUser',
      className: 'd-none d-sm-table-cell',
      render: (taskedUser) => {
         return taskedUser ? `${taskedUser.fname} ${taskedUser.lname}` : null
      }
    }
  ]

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className={selectedForm ? 'col-md-3 mt-3' : 'col-md-6 mt-3'}>
          <Table 
            dataSource={formTemplates} 
            columns={selectionColumns} 
            rowKey="_id"
            rowClassName='hoverPointer'
            onRow={(record, index) => ({
              onClick: () => handleFormTemplateSelect(record),
              'data-testid': `form-template-row-${index + 1}` // Add data-testid attribute
            })
          }
          />
        </div>
        {selectedForm && !deleteClicked && (
        <div className="col-md-9 d-flex justify-content-center flex-column align-items-center"> 
          
          {!creatingForm && 
          <div className="d-flex border-bottom mt-5 mb-5">
          <div className="d-flex align-items-center flex-column mb-4 mx-5">
              <h2>{selectedForm}</h2>
              <FavouritesCheckBox formName={selectedForm} />
              
                
                  <div className="col">
                    <textarea 
                      className="mb-3 form-control" 
                      placeholder="Enter form description" 
                      onChange={handleDescriptionChange}
                      value={formDescription}
                    />
               </div>
               </div>   
                
                <div className="col d-flex flex-column justify-content-around">
                  <Button className="btn btn-primary mb-2 p-3 d-flex align-items-center justify-content-center" onClick={handleCreateForm}>
                    <span>Submit New Form</span>
                  </Button>
                  
                  {/* Commented until functionality is implemented
                   {(auth === 'admin' || auth === 'manager') 
                    && <Button className="btn btn-primary mb-2 p-3 d-flex align-items-center justify-content-center">
                    <NavLink to={`/formbuilder`}style={{ textDecoration: 'none' }}>
                      <span>Edit</span>
                    </NavLink>
                  </Button>} */}
              
                  {(auth === 'admin' || auth === 'manager') 
                    && <Button className="btn btn-primary mb-2 p-3 d-flex align-items-center justify-content-center" onClick={handleOpenDeleteModal}>
                    <span>Delete Template</span>
                  </Button>}
                </div>
                </div>
            }
          {selectedForm && creatingForm &&(
            <FillOutForm
              setCreatingForm= {setCreatingForm} 
              formName={selectedForm}
              formDescription={formDescription}
              setFormDescription={setFormDescription}
              fetchUserForms={fetchUserForms}
            />
          )}
          {!creatingForm && userForms.length > 0 && formTemplates.find(template => template.formName === selectedForm) && (
            <>
              <h1>Prevously Submitted Forms</h1>
              <Table 
                dataSource={userForms} 
                columns={formColumns} 
                rowClassName='hoverPointer'
                rowKey='_id'
                onRow={(record) => ({
                    onClick: () => handleFormRowSelect(record)
                })}
              />
            </>
            )}
          {/* Delete confirmation modal */}
          <Modal show={deleteModalVisible} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Warning! Are you sure? Deleting a template will delete all previously submitted forms associated with it.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>)}
      </div>
    </div>
  );
};

