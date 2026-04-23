import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// This component allows the scroll to go to the beginning when changing the view,
// otherwise it would remain in the position of the previous view. 
// Investigate more about this React behavior :D 

const ScrollToTop = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        if (!("scrollRestoration" in window.history)) {
            return undefined;
        }

        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        return () => {
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location.key]);

    return children;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
    children: PropTypes.any
};