import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Actions as PostActions, fetchPosts } from "../store/Post";

const PostDetail = () => {
  const [myPost, setMyPost] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  //   const post = 5;
  const post = useSelector((state) => {
    return state.post.post;
  });

  const isFetched = useSelector((state) => {
    return state.post.isFetched;
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);
  useEffect(() => {
    if (isFetched) dispatch(PostActions.getPost(id));
  }, [isFetched]);
  useEffect(() => {
    if (post) {
      console.log("my post =========");
      console.log(post);
      setMyPost(post);
    }
  }, [post]);
  return (
    <div>
      {myPost && (
        <Post
          key={myPost?.key}
          item={myPost?.item}
          myKey={myPost?.key}
          userId={myPost?.item?.userid}
          show={true}
        />
      )}
    </div>
  );
};

export default PostDetail;
