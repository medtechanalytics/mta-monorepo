/*
https://github.com/codedthemes/mantis-free-react-admin-template/blob/main/LICENSE
 */

import React, { ReactElement } from 'react';
import { Suspense } from 'react';

// project import
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component: any) => (props: Object):ReactElement => (
    <Suspense fallback={<Loader />}>
        <Component {...props} />
    </Suspense>
);

export default Loadable;
