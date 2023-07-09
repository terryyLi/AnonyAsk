import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { MdKeyboardBackspace } from 'react-icons/md';
import './style.css';

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
          console.log(postData)
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
      {post && (
        <div>
          <Container className="mt-5">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Row key={conversation._id} className="mb-3">
                  <Col>
                    <Card className="py-4 d-flex flex-column" style={{ minHeight: '7vw' }}>
                      <Card.Body className="d-flex flex-column px-4">
                        <div className='mb-4'>
                          <Card.Text>{conversation.question.content}</Card.Text>
                          <small className="response-time text-muted">{formatDateTime(conversation.question.time)}</small>
                        </div>
                        {conversation.answer && (
                          <div className='mt-4'>
                            <Card.Text>{conversation.answer.content}</Card.Text>
                            <small className="response-time text-muted">{formatDateTime(conversation.answer.time)}</small>
                          </div>
                        )}
                        {!conversation.answer && localStorage.getItem('token') && (
                          <Button href={`/createAnswer/${conversation._id}/${postId}`} variant="primary" className="mt-3">
                            Write answer
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ))
            ) : (
              <div className="no-questions">
                <h1>You have no questions yet</h1>
                <img
                  className="img-fluid larger-image"
                  src={require('../assets/empty.svg').default}
                  alt={`empty`}
                />
              </div>
            )}
          </Container>
        </div>
      )}

      {localStorage.getItem('token') && (
        <Link to="/home" className="back-icon">
            <MdKeyboardBackspace size={64} />
        </Link>
      )}
    </Container>
  );
}

export default PostPage;
