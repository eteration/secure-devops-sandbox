/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Secure DevOps!',
  },
  detail: {
    id: `${scope}.detail`,
    defaultMessage:
      'Cloud & Kubernetes provides a rapid, iterative development experience for teams. Azure can provide an end-to-end secure devops solution for your application with minimal effort.',
  },
});
