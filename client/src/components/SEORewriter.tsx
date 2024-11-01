import { Button, Col, Input, Modal, Row } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import ArticleList from './ArticleList'
import { Article } from '../utils/interfaces/article.interface'

export default function SEORewriter() {
    const [originalContent, setOriginalContent] = useState('')
    const [seoContent, setSeoContent] = useState('')
    const [onBrowseContent, setOnBrowseContent] = useState(false)
    const [onSelectArticle, setOnSelectArticle] = useState<Article | null>(null)

    const onChangeOriginalContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setOriginalContent(e.target.value);
    }

    const onChangeSeoContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setSeoContent(e.target.value);
    }

    const handleOk = () => {
        if (!onSelectArticle) return;
        setOriginalContent(onSelectArticle.originalContent);
        if (onSelectArticle.seoContent) {
            setSeoContent(onSelectArticle.seoContent)
        }
        setOnBrowseContent(false);
    }

    const handleCancel = () => {
        setOnBrowseContent(false);
    }

    return (
        <div className='seo-rewriter-container'>
            <Row gutter={[16, 16]}>
                <Col md={12} sm={24} xs={24}>
                    <div className='original-content'>
                        <div className='table-label'>
                            <h4>Nội dung gốc</h4>
                        </div>
                        <div className='table-content'>
                            <Input.TextArea
                                value={originalContent}
                                showCount
                                placeholder='Nhập nội dung'
                                style={{ height: 350, resize: 'none' }}
                                onChange={onChangeOriginalContent}
                            />
                        </div>
                        <div className='nav-features' style={{ margin: '16px 0' }}>
                            <Button style={{ marginRight: '16px' }} onClick={() => setOnBrowseContent(true)}>Chọn bài viết...</Button>
                            <Button style={{ backgroundColor: '#385793', color: '#fff', opacity: originalContent ? 1 : 0.5 }} disabled={!originalContent}>Viết lại SEO</Button>
                        </div>
                    </div>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <div className='seo-content'>
                        <div className='column-label'>
                            <h4>Nội dung SEO</h4>
                        </div>
                        <div className='table-content'>
                            <Input.TextArea
                                value={seoContent}
                                showCount
                                style={{ height: 350, resize: 'none' }}
                                onChange={onChangeSeoContent}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal 
                title="Chọn bài viết" 
                open={onBrowseContent} 
                onOk={handleOk} 
                onCancel={handleCancel} 
                width={590}
                style={{ top: '10px' }}>
                <ArticleList onSelect={onSelectArticle} setSelect={setOnSelectArticle}/>
            </Modal>
        </div>
    )
}
