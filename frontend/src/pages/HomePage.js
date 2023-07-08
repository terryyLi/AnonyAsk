import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import { RiShareForwardLine } from 'react-icons/ri';
import jwt_decode from 'jwt-decode';
import './HomePage.css';

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

const shareLink = async (text) => {
  try {
    await navigator.share({ url: text });
    console.log('Link shared!');
  } catch (error) {
    console.error('Failed to share link: ', error);
    // Fallback to copying to clipboard
    copyToClipboard(text);
  }
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy text: ', error);
    // Handle error
  }
};

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [tooltipShown, setTooltipShown] = useState(false);

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Decode the token to retrieve the username
      const decodedToken = jwt_decode(token);
      setUsername(decodedToken.username);
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (username) {
        try {
          const response = await fetch(`https://anonyask-odnuj43iea-uc.a.run.app/api/posts/user/${username}`);
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
          } else {
            // Handle error response
          }
        } catch (error) {
          console.error(error);
          // Handle error
        }
      }
    };

    fetchPosts();
  }, [username]);

  const handleIconMouseEnter = () => {
    if (tooltipShown) {
      setTooltipShown(false);
    }
  };

  return (
    <Container className="text-center">
      <h1 className="mt-5">Welcome, {username}</h1>

      {posts.length === 0 ? (
        <div className="no-questions">
        <h2>You have no posts yet.</h2>
          <img
            className="img-fluid larger-image"
            src={require('../assets/empty.svg').default}
            alt={`empty`}
          />
        </div>
      ) : (
        <Container className="mt-5">
          {posts.map((post) => (
            <Row key={post._id} className="mb-3">
              <Col>
                <Link to={`/post/${post._id}`} className="link-style">
                  <Card className="py-4 d-flex flex-column custom-card" style={{ minHeight: '7vw' }}>
                    <Card.Body className="d-flex flex-column px-5">
                      <Card.Title className="text-center mw-10">{post.title}</Card.Title>
                      <div className="mt-auto text-muted ml-0 text-left">
                        <small className="post-time">{formatDateTime(post.time)}</small>
                      </div>
                      <div className="copy-icon">
                        <OverlayTrigger
                          trigger={['hover', 'focus']}
                          placement="left"
                          overlay={<Tooltip id="tooltip">{tooltipShown ? 'Copied to clipboard!' : 'Share with friends'}</Tooltip>}
                        >
                          <div
                            onClick={
                              (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                const uniqueLink = `${window.location.origin}/createConversation/${post._id}`;
                                if (navigator.share) {
                                  shareLink(uniqueLink);
                                } else {
                                  copyToClipboard(uniqueLink);
                                  setTooltipShown(true);
                                }
                              }
                            }
                            onMouseEnter={handleIconMouseEnter}
                            className="icon-container"
                          >
                            <RiShareForwardLine size={26} />
                          </div>
                        </OverlayTrigger>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          ))}
        </Container>
      )}

      <Link to="/createPost" className="add-icon">
        <MdAdd size={64} />
      </Link>
    </Container>
  );
}

export default HomePage;
