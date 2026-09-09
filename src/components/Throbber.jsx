/**
 * src/components/Throbber.jsx
 */


import '../css/throbber.css'


// Export also as a plain `<div>` element so that it can be used
// as an ErrorBoundary fallback
export const throbber = (
  <div className="lds-ring">
    <div></div>
    <div></div>
    <div></div>
  </div>
)


export default () => throbber
