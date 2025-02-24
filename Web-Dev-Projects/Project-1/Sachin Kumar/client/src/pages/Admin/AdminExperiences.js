import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, message, Modal } from 'antd'
import { HideLoading, ReloadData, ShowLoading } from '../../redux/rootSlice';
import axios from 'axios';
import API_URL from "../../config";

function Experiences() {
  const dispatch = useDispatch();
  const { portfolioData } = useSelector(state => state.root);
  const { experiences } = portfolioData;
    const [showAddEditModal , setShowAddEditModal] = React.useState(false);
    const[selectedItemForEdit , setSelectedItemForEdit ] = React.useState(null);
    const[type = "add" , setType] = React.useState("add");
    const instance = axios.create({
        baseURL: API_URL, // Your backend URL
    });

   const onFinish = async (values) =>{
    try {
        dispatch(ShowLoading())
        let response
        if(selectedItemForEdit){
            response = await instance.post("/update-experience",{
                ...values,
                _id:selectedItemForEdit._id,
            });
        }
        else {
            response = await instance.post("/add-experience",values);
        }
        dispatch(HideLoading());
        if (response.data.success) {
          message.success(response.data.message);
          setShowAddEditModal(false);
          setSelectedItemForEdit(null);
          dispatch(HideLoading());
          dispatch(ReloadData(true));
        }
        else{
          message.error(response.data.message)
        }
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message)
      }
};

const onDelete = async (item)=>{
    console.log(item._id);
    
    try {
        dispatch(ShowLoading());
        const response = await instance.post("/delete-experience",{
            _id: item._id,
        });
        
        dispatch(HideLoading());
        if (response.data.success) {
            message.success(response.data.message);
            dispatch(HideLoading());
            dispatch(ReloadData(true));
        }
        else{
            message.error(response.data.message);
        }
    } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
    }
};
  return (
    <div>
        <div className='flex justify-end' >
            <button className='bg-primary px-5 py-2 text-white rounded-md' onClick={()=>{
                setSelectedItemForEdit(null);
                setShowAddEditModal(true);
            }}> 
                Add Experience
            </button>
        </div>

      <div className='grid grid-cols-4 gap-5 mt-5 sm:grid-cols-1'>
        {experiences.map((experience, index) => (
          <div key={index} className='shadow border p-5 border-y-gray-400 flex-col ' >
            <h1 className='text-primary text-xl font-bold' >{experience.period}</h1>
            <hr />
            <h1> <b>Company :</b> {experience.company}</h1>
            <h1><b>Role :</b> {experience.title}</h1>
            
            <h1 className='py-5'> <b>Description :</b> {experience.description}</h1>
            <div className='flex justify-end gap-5 mt-5'>
            
            <button className='px-5 py-2 bg-red-500 text-white rounded-md' type='submit'
            onClick={()=>{
                onDelete(experience);
            }
            } >Delete</button>
            <button className='px-5 py-2 bg-primary text-white rounded-md' type='submit' onClick={()=>{
                setSelectedItemForEdit(experience);
                setShowAddEditModal(true);
                setType("edit");
            }} >Edit</button>
            </div>
          </div>
        ))}
      </div>

        {
            (type==="add" ||selectedItemForEdit) &&
        
      <Modal visible={showAddEditModal }
        title = { selectedItemForEdit ? "Edit Experience" : "Add Experience" }
        footer={null}
        onCancel={() => {
            setShowAddEditModal(false);
            setSelectedItemForEdit(null);
        }} >

        <Form layout='vertical' onFinish={onFinish}
            initialValues={selectedItemForEdit}
        >
            <Form.Item name='period' label="Period" >
                <input placeholder='Period' />
            </Form.Item>
            <Form.Item name='company' label="Company" >
                <input placeholder='Company' />
            </Form.Item>
            <Form.Item name='title' label="Title" >
                <input placeholder='Title' />
            </Form.Item>
            <Form.Item name='description' label="Description" >
                <textarea placeholder='Description' />
            </Form.Item>

            <div className='flex justify-end'>
                <button className='border-primary text-primary px-5 py-2 bg-white' onClick={()=>{
                    setShowAddEditModal(false);
                    setSelectedItemForEdit(null);
                }} 

                >
                    Cancel
                </button>
                <button className='bg-primary text-white px-5 py-2'>
                     {selectedItemForEdit ? " Update " : " Add "}
                </button>
            </div>
        </Form>

      </Modal>
        }
    </div>
  );
}

export default Experiences;
