import React, { useEffect, useState } from 'react'
import { Article } from '../utils/interfaces/article.interface'
import { List } from 'antd'
import { FlagOutlined } from '@ant-design/icons';
import Paginator from './Paginator';
import { getDataAPI } from '../utils/fetch/http.request';
import { API_SERVICE } from '../utils/config';
import { ArticleDataResponse } from '../utils/responses/article.response';

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
    { onSelect, setSelect }:
        { onSelect: null | Article, setSelect: (article: null | Article) => void }) {
    const [articles, setArticles] = useState(articlesData);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const response = await getDataAPI<ArticleDataResponse>(API_SERVICE.ARTICLE, `list?limit=${10}&page=${page}`)
                setArticles({ total: response.data.data.total, data: response.data.data.data, page: parseInt(response.data.data.page) })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [page])

    const onPageChange = (num: number) => {
        setPage(num);
    }

    return (
        <div className='articles-list-container'>
            <List
                itemLayout="horizontal"
                loading={loading}
                dataSource={articles.data}
                renderItem={(item, index) => (
                    <List.Item
                        style={{
                            cursor: 'pointer',
                            backgroundColor: onSelect?._id === item._id ? '#dfecff' : '#fff'
                        }}
                        onClick={() => setSelect(item)}
                    >
                        <List.Item.Meta
                            avatar={<FlagOutlined />}
                            title={<label>{item.title}</label>}
                            description={item.originalContent.length > 200 ? item.originalContent.slice(0, 200) + '...' : item.originalContent}
                        />
                    </List.Item>
                )}
                style={{ height: '432px', overflowY: 'auto' }}
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
