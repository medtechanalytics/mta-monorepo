/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';
import { useState } from 'react';

import { Box, CardActions, Collapse, Divider, IconButton, Tooltip } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import reactElementToJSXString from 'react-element-to-jsx-string';

import SyntaxHighlight from '../../utils/SyntaxHighlight';

import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const HighlighterPropTypes = {
  children: PropTypes.node,
  codeHighlight: PropTypes.bool
};

const Highlighter = ({ children, ...others }: InferProps<typeof HighlighterPropTypes>) => {
  const [highlight, setHighlight] = useState(false);

  return (
    <Box sx={{ position: 'relative' }}>
      <CardActions sx={{ justifyContent: 'flex-end', p: 1, mb: highlight ? 1 : 0 }}>
        <Box sx={{ display: 'flex', position: 'inherit', right: 0, top: 6 }}>
          <CopyToClipboard text={reactElementToJSXString(children, { showFunctions: true, maxInlineAttributesLineLength: 100 })}>
            <Tooltip title="Copy the source" placement="top-end">
              <IconButton color="secondary" size="small" sx={{ fontSize: '0.875rem' }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Show the source" placement="top-end">
            <IconButton
              sx={{ fontSize: '0.875rem' }}
              size="small"
              color={highlight ? 'primary' : 'secondary'}
              onClick={() => setHighlight(!highlight)}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
      <Collapse in={highlight}>
        {highlight && (
          <SyntaxHighlight>
            {reactElementToJSXString(children, {
              showFunctions: true,
              showDefaultProps: false,
              maxInlineAttributesLineLength: 100
            })}
          </SyntaxHighlight>
        )}
      </Collapse>
    </Box>
  );
};

export default Highlighter;