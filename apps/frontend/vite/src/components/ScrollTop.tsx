/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import PropTypes, { InferProps } from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const ScrollTopPropTypes = {
    children: PropTypes.node
};

const ScrollTop = ({ children }: InferProps<typeof ScrollTopPropTypes>) => {
    const location = useLocation();
    const { pathname } = location;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    return <>
        {children}
        </>;
};

export default ScrollTop;
