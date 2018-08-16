import React from 'react'
import { UserConsumer } from '../../Context.jsx'

const withContext = Component => props => // eslint-disable-line
  <UserConsumer>
    { context => <Component { ...props } context={ context } /> }
  </UserConsumer>

export default withContext
