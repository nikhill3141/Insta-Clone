import { useSelector } from 'react-redux';
import Post from './Post'

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  if (!Array.isArray(posts)) {
    console.error("Invalid posts data:", posts); // Debugging
    return <div>Error loading posts.</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts
