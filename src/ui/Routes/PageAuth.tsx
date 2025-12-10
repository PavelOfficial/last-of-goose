import { Button, Form, Input, Typography } from 'antd';
import { useAuthLoginMutation } from 'query/api/appApi.api';
import { authGuard } from '../authGuard';
import { useState, type FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/appSlice';

interface FormShape {
    username: string
    password: string
}

const AuthPageBase: FunctionComponent = () => {
  const dispatch = useDispatch()
  const [mutate] = useAuthLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const onFinish = async (values: FormShape) => {
    try {
      const result = await mutate(values);
      const error = (result.error as any);

      if (error && error.data!) {
        setErrorMessage(error.data.message);
      } else if (result.data) {
        setErrorMessage("");
        dispatch(setToken({ token: result.data!.token!}));      
      }
    } catch (error) {
      console.log(error);
    }
    // console.log('Success:', values);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={(errorInfo) => {
        console.log('Failed:', errorInfo);
      }}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Typography.Text type="danger">{errorMessage}</Typography.Text>
    </Form>
  );
};

const AuthPage = authGuard(AuthPageBase);

export default AuthPage;