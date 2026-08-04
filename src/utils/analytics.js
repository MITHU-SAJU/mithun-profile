import ReactGA from 'react-ga4';

const TRACKING_ID = "G-793421HWJ4"; // Replace with your actual GA4 Measurement ID

// Initialize GA4
export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

// Track Page Views
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track Custom Events
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
