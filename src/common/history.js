// history.js
// https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
// AND (fixed "Invariant Violation: Browser history needs a DOM")
// https://github.com/ReactTraining/react-router/issues/4977
// import { createBrowserHistory } from 'history';
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

// export default createBrowserHistory();
export default typeof window !== 'undefined' ? createBrowserHistory() : createMemoryHistory();
