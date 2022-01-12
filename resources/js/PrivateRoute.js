import React from 'react';
import {Redirect, Route, withRouter} from 'react-router-dom';
import { observer, inject } from 'mobx-react';

const PrivateRoute = ({ component: Component, path, userStore, ...rest }) => (
<Route path={path}
       {...rest}
       render={props => userStore.isLoggedIn ? (
       <Component {...props} />) : (<Redirect to={{
          pathname: "/login",
          state: {
            prevLocation: path,
            error: "Debes hacer login primero!",
          },
        }}
      />
    )
  }
/>);
export default inject('userStore')(withRouter(observer(PrivateRoute)));