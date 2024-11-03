import React, { useEffect, useState } from 'react'
import { Article } from '../utils/interfaces/article.interface'
import { Button, Col, List, Row, Select, Space } from 'antd'
import { CheckCircleOutlined, CloudUploadOutlined, FlagOutlined } from '@ant-design/icons';
import Paginator from './Paginator';
import { getDataAPI, postDataAPI } from '../utils/fetch/http.request';
import { API_SERVICE } from '../utils/config';
import { ArticleDataResponse } from '../utils/responses/article.response';
import Search from 'antd/es/input/Search';

export interface IArticleList {
    data: Article[],
    page: number,
    total: number
}

const articlesData: IArticleList = {
    data: [],
    page: 1,
    total: 0,
}

export default function ArticleList(
    { onSelect, setSelect, refreshList }:
        { onSelect: null | Article, setSelect: (article: null | Article) => void, refreshList: boolean }) {
    const [articles, setArticles] = useState(articlesData);
    const [reload, setReload] = useState(false);
    const [page, setPage] = useState(1);
    const [searchString, setSearchString] = useState('')
    const [sortString, setSortString] = useState('&sort=-createdAt')
    const [loading, setLoading] = useState(false);
    const [onCrawling, setOnCrawling] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const response =
                    await getDataAPI<ArticleDataResponse>(
                        API_SERVICE.ARTICLE, `article/list?limit=${10}&page=${page}${searchString}${sortString}`
                    )
                setArticles({
                    total: response.data.total,
                    data: response.data.data,
                    page: parseInt(response.data.page)
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [page, searchString, sortString, refreshList, reload])

    const onPageChange = (num: number) => {
        setPage(num);
    }

    const onSearch = (value: string) => {
        setPage(1)
        if (value) {
            setSearchString(`&search=${value}`);
        } else {
            setSearchString('')
        }
    }

    const onSortChange = (value: string) => {
        if (value) {
            setSortString(`&${value}`);
        } else {
            setSortString('');
        }
    }

    const crawlArticle = async () => {
        try {
            setOnCrawling(true)
            await postDataAPI(API_SERVICE.CRAWLER, 'crawl', {})
            setReload(!reload);
        } catch (error) {
            console.log(error)
        } finally {
            setOnCrawling(false)
        }
    }

    const IconText = ({ icon, text, color }: { icon: any, text: string, color: string }) => (
        <Space>
          {React.createElement(icon, { style: { color } })}
          {text}
        </Space>
    );

    return (
        <div className='articles-list-container'>
            <Row gutter={[16, 16]}>
                <Col>
                    <Button onClick={crawlArticle} loading={onCrawling}>
                        <CloudUploadOutlined />Tải thêm
                    </Button>
                </Col>
                <Col>
                    <Search
                        placeholder="Nhập từ khóa tìm kiếm..."
                        allowClear
                        onSearch={onSearch}
                        style={{
                            width: 230,
                        }}
                    />
                </Col>
                <Col>
                    <Select
                        onChange={onSortChange}
                        style={{ minWidth: '152px' }}
                        placeholder="Sắp xếp theo"
                    >
                        <Select.Option value="sort=-createdAt">Mới nhất</Select.Option>
                        <Select.Option value="sort=createdAt">Cũ nhất</Select.Option>
                    </Select>
                </Col>
            </Row>
            <List
                itemLayout="vertical"
                loading={loading}
                dataSource={articles.data}
                renderItem={(item, index) => (
                    <List.Item
                        style={{
                            cursor: 'pointer',
                            backgroundColor: onSelect?._id === item._id ? '#dfecff' : '#fff'
                        }}
                        actions={[  
                            <IconText 
                                icon={CheckCircleOutlined} 
                                text={item.seoContent ? 'Đã SEO' : 'Chưa SEO'} 
                                key="seo-confirm"
                                color={item.seoContent ? '#52C41A' : '#ccc'} 
                            /> 
                        ]}
                        onClick={() => setSelect(item)}
                    >
                        <List.Item.Meta
                            avatar={<FlagOutlined />}
                            title={<label>{item.title}</label>}
                            description={item.originalContent.length > 200 ? item.originalContent.slice(0, 200) + '...' : item.originalContent}
                        />
                    </List.Item>
                )}
                style={{ height: '402px', overflowY: 'auto' }}
            />
            {
                articles.data.length > 0 &&
                <Paginator<IArticleList>
                    list={articles}
                    limit={10}
                    callback={onPageChange}
                />
            }
        </div>
    )
}
