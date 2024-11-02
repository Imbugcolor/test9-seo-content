import { Button, Col, Input, Modal, Row } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import ArticleList from './ArticleList'
import { Article } from '../utils/interfaces/article.interface'
import { postDataAPI } from '../utils/fetch/http.request'
import { API_SERVICE } from '../utils/config'
import { RewriteContentSeoDataResponse } from '../utils/responses/content-seo.response'
import ReactQuill from 'react-quill';

export default function SEORewriter() {
    const [originalContent, setOriginalContent] = useState('')
    const [seoContent, setSeoContent] = useState('')
    const [onBrowseContent, setOnBrowseContent] = useState(false)
    const [onSelectArticle, setOnSelectArticle] = useState<Article | null>(null)
    const [onRewriting, setOnRewriting] = useState(false)

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
        } else {
            setSeoContent('')
        }
        setOnBrowseContent(false);
    }

    const handleCancel = () => {
        setOnBrowseContent(false);
    }

    const onRewriteSEOSubmit = async() => {
        if (!onSelectArticle) return;
        try {
            setOnRewriting(true)
            const response = await postDataAPI<RewriteContentSeoDataResponse>(API_SERVICE.SEO, `content-seo/generate/${onSelectArticle._id}`, {})
            setSeoContent(response.data.data);
        } catch (error) {
            console.log(error)
        } finally {
            setOnRewriting(false)
        }
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
                                disabled={onRewriting}
                            />
                        </div>
                        <div className='nav-features' style={{ margin: '16px 0' }}>
                            <Button style={{ marginRight: '16px' }} onClick={() => setOnBrowseContent(true)}>Chọn bài viết...</Button>
                            <Button 
                                style={{ 
                                    backgroundColor: '#385793', 
                                    color: '#fff', 
                                    opacity: originalContent ? 1 : 0.5 
                                }} 
                                disabled={!originalContent}
                                onClick={onRewriteSEOSubmit}
                                loading={onRewriting}
                                >Viết lại SEO</Button>
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
                                disabled={onRewriting}
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
