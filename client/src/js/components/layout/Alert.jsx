import React from 'react'
import PropTypes from 'prop-types'

import { MESSAGE_UNVERIFIED } from '../../constants'
import { UserConsumer } from '../../Context.jsx'

const Alert = () =>
  <UserConsumer>
    { ({ loggedIn, user: { verified }, alert }) => {
      if (!verified && loggedIn) return <AlertBox text={ MESSAGE_UNVERIFIED } />

      if (alert) return <AlertBox text={ alert } />
      else return null
    } }
  </UserConsumer>

const AlertBox = props => {
  let text = props.text.split('\n').map((line, i) => <span key={ i }>{ line }<br /></span>)

  return (
    <article className='message is-warning'>
      <div className='message-body'>{ text }</div>
    </article>
  )
}

AlertBox.propTypes = { text: PropTypes.string.isRequired }

export default Alert
