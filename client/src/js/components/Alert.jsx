import React, { Component } from 'react'

import { UserConsumer } from '../Context.jsx'

class Alert extends Component {
  render () {
    return (
      <UserConsumer>
        { ({ alert }) => {
          if (alert) {
            let text = alert.split('\n').map((line, i) => <span key={ i }>{ line }<br /></span>)

            return (
              <article className='message is-warning'>
                <div className='message-body'>{ text }</div>
              </article>
            )
          } else {
            return null
          }
        } }
      </UserConsumer>
    )
  }
}

export default Alert
