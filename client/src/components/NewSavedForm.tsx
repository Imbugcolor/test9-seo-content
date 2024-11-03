import { Button, Form, Input } from 'antd'

export interface SavedFormInput {
    title: string,
    url: string,
}

export default function NewSavedForm({ onSubmitSavedForm }: { onSubmitSavedForm: (values: any) => void }) {
    const onFinish = (values: SavedFormInput) => {
        onSubmitSavedForm(values);
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form 
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item label="Tiêu đề" name='title' rules={[
                {
                    required: true,
                    message: 'Hãy nhập tiêu đề bài viết!',
                },
            ]}>
                <Input placeholder="Tiêu đề bài viết..." />
            </Form.Item>
            <Form.Item label="URL" name='url' rules={[
                {
                    required: true,
                    message: 'Hãy nhập URL bài viết!',
                },
            ]}>
                <Input placeholder="https://www.domain.com" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit'>Submit</Button>
            </Form.Item>
        </Form>
    )
}
