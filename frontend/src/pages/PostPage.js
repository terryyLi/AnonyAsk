import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy text: ', error);
    // Handle error
  }
};

function PostPage() {
  const [post, setPost] = useState(null);
  const [conversations, setConversations] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPostAndConversations = async () => {
      try {
        const [postResponse, conversationsResponse] = await Promise.all([
          fetch(`https://anonyask-odnuj43iea-uc.a.run.app/api/posts/${postId}`),
          fetch(`https://anonyask-odnuj43iea-uc.a.run.app/api/conversations/${postId}`)
        ]);
  
        if (postResponse.ok && conversationsResponse.ok) {
          const postData = await postResponse.json();
          const conversationsData = await conversationsResponse.json();
          setPost(postData);
          setConversations(conversationsData || []);
        } else {
          // Handle error response
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
  
    fetchPostAndConversations();
  }, [postId]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };

    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  return (
    <Container className="text-center">
      {localStorage.getItem('token') && (
        <Link to="/home" className="btn btn-primary">
          Back to Home
        </Link>
      )}
      {post && (
        <div>
          <h1 className="mt-5">{post.title}</h1>

          <Container className="mt-5">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Row key={conversation._id} className="mb-3">
                  <Col>
                    <Card className="py-4 d-flex flex-column">
                      <Card.Body className="d-flex flex-column">
                        <Card.Text>{conversation.question.content}</Card.Text>
                        {conversation.answer && (
                          <Card.Text>{conversation.answer.content}</Card.Text>
                        )}
                        <div className="mt-auto text-muted">
                          <small>{formatDateTime(conversation.question.time)}</small>
                        </div>
                        {!conversation.answer && localStorage.getItem('token') && (
                          <Link
                            to={`/createAnswer/${conversation._id}/${postId}`}
                            className="btn btn-primary"
                          >
                            Add Answer
                          </Link>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ))
            ) : (
              <div className="no-questions">
                <p>Oops! No questions yet.</p>
                <Button
                  variant="primary"
                  onClick={(event) => {
                    event.preventDefault(); // Prevent default behavior
                    event.stopPropagation(); // Stop event propagation
                    const uniqueLink = `${window.location.origin}/createConversation/${post._id}`;
                    copyToClipboard(uniqueLink);
                  }}
                >
                  Click here to share with your friends
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </Container>
  );
}

export default PostPage;
