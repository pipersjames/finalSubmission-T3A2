import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { NavLink } from 'react-router-dom';

export default function ForgotPassword() {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <NavLink to="#" onClick={showModal}>Forgot your password?</NavLink>
      <Modal
        title="Contact Administrator"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>
        ]}
      >
        <p>Please contact your network administrator for assistance with your password.</p>
      </Modal>
    </div>
  );
}