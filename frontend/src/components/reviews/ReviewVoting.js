import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import {
    ThumbUp,
    ThumbDown,
    ThumbUpOutlined,
    ThumbDownOutlined,
    Flag
} from '@mui/icons-material';
import { reviewService } from '../../services/reviewService';
import './ReviewVoting.css';

const ReviewVoting = ({ 
    reviewId, 
    initialVotes = { helpful: 0, unhelpful: 0 },
    initialUserVote = null,
    onVoteUpdate 
}) => {
    const [votes, setVotes] = useState(initialVotes);
    const [userVote, setUserVote] = useState(initialUserVote);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    const handleVote = async (voteType) => {
        try {
            setLoading(true);
            setError(null);

            // If user is clicking their existing vote, remove it
            const newVoteType = userVote === voteType ? null : voteType;

            const response = await reviewService.voteReview(reviewId, newVoteType);

            setVotes(response.votes);
            setUserVote(newVoteType);
            onVoteUpdate?.(response);

        } catch (err) {
            if (err.message === 'User not authenticated') {
                setShowLogin(true);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        try {
            await reviewService.reportReview(reviewId);
            // Show success message
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box className="review-voting">
            <Box className="voting-buttons">
                <Tooltip title="Helpful">
                    <IconButton
                        onClick={() => handleVote('helpful')}
                        disabled={loading}
                        color={userVote === 'helpful' ? 'primary' : 'default'}
                    >
                        {userVote === 'helpful' ? <ThumbUp /> : <ThumbUpOutlined />}
                    </IconButton>
                </Tooltip>
                <Typography variant="body2" className="vote-count">
                    {votes.helpful}
                </Typography>

                <Tooltip title="Not Helpful">
                    <IconButton
                        onClick={() => handleVote('unhelpful')}
                        disabled={loading}
                        color={userVote === 'unhelpful' ? 'error' : 'default'}
                    >
                        {userVote === 'unhelpful' ? <ThumbDown /> : <ThumbDownOutlined />}
                    </IconButton>
                </Tooltip>
                <Typography variant="body2" className="vote-count">
                    {votes.unhelpful}
                </Typography>

                <Tooltip title="Report Review">
                    <IconButton
                        onClick={handleReport}
                        className="report-button"
                    >
                        <Flag />
                    </IconButton>
                </Tooltip>
            </Box>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showLogin}
                autoHideDuration={6000}
                onClose={() => setShowLogin(false)}
            >
                <Alert severity="info" onClose={() => setShowLogin(false)}>
                    Please log in to vote on reviews
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReviewVoting; 