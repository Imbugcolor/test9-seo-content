import { Button, Col, Input, Modal, notification, Row } from 'antd'
import { ChangeEvent, useState } from 'react'
import ArticleList from './ArticleList'
import { Article } from '../utils/interfaces/article.interface'
import { patchDataAPI, postDataAPI } from '../utils/fetch/http.request'
import { API_SERVICE } from '../utils/config'
import { AnalyzeContentSeoDataResponse, RewriteContentSeoDataResponse } from '../utils/responses/content-seo.response'
import ReactMarkdown from "react-markdown";
import { EyeOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import NewSavedForm, { SavedFormInput } from './NewSavedForm'
import { SavedArticleResponse } from '../utils/responses/article.response'

export default function SEORewriter() {
    const [notify, contextHolder] = notification.useNotification();
    const [originalContent, setOriginalContent] = useState('')
    const [seoContent, setSeoContent] = useState('')
    const [analysisData, setAnalysisData] = useState('')
    const [onBrowseContent, setOnBrowseContent] = useState(false)
    const [onPreview, setOnPreview] = useState(false)
    const [onSelectArticle, setOnSelectArticle] = useState<Article | null>(null)
    const [onRewriting, setOnRewriting] = useState(false)
    const [onAnalyzing, setOnAnalyzing] = useState(false)
    const [onNewSaved, setOnNewSaved] = useState(false)
    const [refreshList, setRefreshList] = useState(false)

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
        setAnalysisData('')
    }

    const handleCancel = () => {
        setOnBrowseContent(false);
    }

    const onAnalyzeSubmit = async () => {
        if (!originalContent) return;
        try {
            setOnAnalyzing(true)
            const response =
                await postDataAPI<AnalyzeContentSeoDataResponse>(
                    API_SERVICE.SEO, `content-seo/analyze-content`, { content: originalContent }
                )
            setAnalysisData(response.data);
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setOnAnalyzing(false)
        }
    }

    const onRewriteSEOSubmit = async () => {
        if (!originalContent) return;
        try {
            setOnRewriting(true)
            const response =
                await postDataAPI<RewriteContentSeoDataResponse>(
                    API_SERVICE.SEO, `content-seo/generate`, { content: originalContent }
                )
            setSeoContent(response.data);

        } catch (error) {
            console.log(error)
        } finally {
            setOnRewriting(false)
        }
    }

    const handleSaveSEOArticle = async () => {
        if(!seoContent) return;
        if (onSelectArticle) {
            await patchDataAPI<SavedArticleResponse>(API_SERVICE.ARTICLE, `article/update/${onSelectArticle._id}`, { seoContent })
            notify.success({ message: 'Saved success.'})
            setRefreshList(!refreshList);
        } else {
            setOnNewSaved(true);
            // const saved = await patchDataAPI(API_SERVICE.ARTICLE, 'article/create',)
        }
    }

    const onSubmitSavedForm = async(values: SavedFormInput) => {
        const { title, url } = values;
        const newArticle = {
            content: originalContent,
            seoContent,
            title,
            url,
        }
        await postDataAPI<SavedArticleResponse>(API_SERVICE.ARTICLE, 'article/create', newArticle)
        setRefreshList(!refreshList);
    }

    const handleNewArticle = () => {
        setOnSelectArticle(null)
        setOriginalContent('')
        setSeoContent('')
        setAnalysisData('')
    }

    return (
        <div className='seo-rewriter-container'>
             {contextHolder}
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
                                disabled={onRewriting || onAnalyzing}
                            />
                        </div>
                        <div className='nav-features' style={{ margin: '16px 0' }}>
                            {
                                onSelectArticle &&
                                <Button 
                                    onClick={handleNewArticle} 
                                    disabled={!onSelectArticle}
                                    style={{ marginRight: '16px' }}
                                ><PlusOutlined />Tạo mới</Button>
                            }
                            <Button onClick={() => setOnBrowseContent(true)}>Chọn bài viết...</Button>
                            <Button
                                style={{
                                    margin: '0 16px',
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    opacity: originalContent ? 1 : 0.5
                                }}
                                disabled={!originalContent}
                                onClick={onAnalyzeSubmit}
                                loading={onAnalyzing}
                            >Phân tích</Button>
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
                        <div className='nav-features' style={{ margin: '16px 0' }}>
                            <Button onClick={() => setOnPreview(true)}><EyeOutlined />Preview</Button>
                            <Button 
                                onClick={handleSaveSEOArticle} 
                                style={{ margin: '0 16px' }}
                            >
                                <SaveOutlined />Lưu
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            {
                analysisData &&
                <Row>
                    <Col>
                        <div className='analysis-content'>
                            <ReactMarkdown>{analysisData}</ReactMarkdown>
                        </div>
                    </Col>
                </Row>
            }
            <Modal
                title="Chọn bài viết"
                open={onBrowseContent}
                onOk={handleOk}
                onCancel={handleCancel}
                width={590}
                style={{ top: '10px' }}
                >
                <ArticleList 
                    onSelect={onSelectArticle} 
                    setSelect={setOnSelectArticle} 
                    refreshList={refreshList}
                />
            </Modal>
            <Modal
                title="Xem trước bài viết"
                open={onPreview}
                onCancel={() => setOnPreview(false)}
                footer={null}
                width={890}
                style={{ top: '10px' }}
                >
                <div style={{ height: '432px', overflow: 'auto' }}>
                    <ReactMarkdown>{seoContent}</ReactMarkdown>
                </div>
            </Modal>
            <Modal
                title="Lưu bài viết"
                open={onNewSaved}
                onCancel={() => setOnNewSaved(false)}
                footer={null}
                width={690}
                style={{ top: '10px' }}
                >
                    <NewSavedForm onSubmitSavedForm={onSubmitSavedForm}/>
            </Modal>
        </div>
    )
}
