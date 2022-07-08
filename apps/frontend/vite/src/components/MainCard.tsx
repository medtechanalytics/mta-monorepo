/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';
import { ForwardedRef, forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// project import
import Highlighter from './third-party/Highlighter';

const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};


const MainCardPropTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.node,
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  codeHighlight: PropTypes.bool,
  content: PropTypes.bool,
  children: PropTypes.node
};

const MainCard = forwardRef(
    (
        {
          border = true,
          boxShadow,
          children,
          content = true,
          contentSX = {},
          darkTitle,
          divider = true,
          elevation,
          secondary,
          shadow,
          sx = {},
          title,
          codeHighlight,
          ...others
        }: InferProps<typeof MainCardPropTypes>,
        ref: ForwardedRef<any>
    ) => {
      const theme = useTheme();
      boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

      return (
          <Card
              elevation={elevation || 0}
              ref={ref}
              {...others}
              sx={{
                ...sx,
                border: border ? '1px solid' : 'none',
                borderRadius: 2,
                borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A700,
                boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',
                ':hover': {
                  boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'
                },
                '& pre': {
                  m: 0,
                  p: '16px !important',
                  fontFamily: theme.typography.fontFamily,
                  fontSize: '0.75rem'
                }
              }}
          >
            {/* card header and action */}
            {!darkTitle && title && (
                <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />
            )}
            {darkTitle && title && (
                <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
            )}

            {/* content & header divider */}
            {title && divider && <Divider />}

            {/* card content */}
            {content && <CardContent sx={contentSX}>{children}</CardContent>}
            {!content && children}

            {/* card footer - clipboard & highlighter  */}
            {codeHighlight && (
                <>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <Highlighter codeHighlight={codeHighlight} >
                    {children}
                  </Highlighter>
                </>
            )}
          </Card>
      );
    }
);

export default MainCard;