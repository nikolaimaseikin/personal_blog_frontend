import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import axios from '../axios';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { useState } from 'react';

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector(state => state.posts);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const userData = useSelector((state) => state.auth.data);
  const [sortBy, setSortBy] = useState(0); // Сортировать по 0 - по новизне, 1 - по популярности

  const onClickSortByNew = () => {
    setSortBy(0);
    console.log(posts.items.sort((item1, item2) => {
      return item1.createdAt - item2.createdAt
    }));
  };

  const onClickSortByPopularity = () => {
    setSortBy(1);
  };

  
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={sortBy} aria-label="basic tabs example">
        <Tab onClick={onClickSortByNew} label="Новые" />
        <Tab onClick={onClickSortByPopularity} label="Популярные" />
      </Tabs>



      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => 
          isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ) : (
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:8000${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
