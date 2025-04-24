import { TransitionGroup, CSSTransition } from 'react-transition-group';

const AdminLayout = () => {
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={300}
                classNames="page-transition"
            >
                <div className="page-content">
                    {/* Page content */}
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
}; 