/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';

import { motion } from 'framer-motion';

const AnimateButtonPropTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['slide', 'scale', 'rotate'])
};

export default function AnimateButton({ children, type }: InferProps<typeof AnimateButtonPropTypes>) {
  switch (type) {
    case 'rotate':
    case 'slide':
    case 'scale':
    default:
      return (
        <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
          {children}
        </motion.div>
      );
  }
}

