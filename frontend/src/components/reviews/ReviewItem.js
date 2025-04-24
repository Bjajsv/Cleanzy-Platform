import React from 'react';
import ReviewVoting from './ReviewVoting';

const ReviewItem = ({ review }) => {
    const handleVoteUpdate = (updatedReview) => {
        console.log('Vote updated:', updatedReview);
        // Update parent component if needed
    };

    return (
        <div className="review-item">
            {/* Review content */}
            <ReviewVoting
                reviewId={review.id}
                initialVotes={review.votes}
                initialUserVote={review.userVote}
                onVoteUpdate={handleVoteUpdate}
            />
        </div>
    );
}; 