import React, { useState, useEffect } from 'react';
import { Descriptions, Spin, Alert } from 'antd';
import API from '../utils/API';

function User() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await API.get('/user/me');
        if (result.status === 200) {
          setUser(result.data);
        } else {
          console.log("failed");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [])

  if (loading) {
    return (<Spin />);
  } else {
    return (
      <React.Fragment>
        {error &&
          <Alert
            message="Error"
            description={error.message}
            type="error"
            closable
          />
        }
        <Descriptions title="User Info">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="E-Mail">{user.email}</Descriptions.Item>
          <Descriptions.Item label="First Name">{user.first_name}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{user.last_name}</Descriptions.Item>
          <Descriptions.Item label="Created at">{user.created_at}</Descriptions.Item>
        </Descriptions>
      </React.Fragment>
    );
  }
}

export default User;