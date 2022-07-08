/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';

// third-party
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';


const SyntaxHighlightPropTypes = {
  children: PropTypes.node
};

export default function SyntaxHighlight({ children, ...others }: InferProps<typeof SyntaxHighlightPropTypes>) {
  return (
    <SyntaxHighlighter language="javacript" showLineNumbers style={a11yDark} {...others}>
      {children as string}
    </SyntaxHighlighter>
  );
}
