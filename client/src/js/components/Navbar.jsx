import React, { Component } from 'react'

class Navbar extends Component {
  render () {
    return (
      <nav className='navbar is-light is-fixed-top'>
        <div className='navbar-brand'>
          <a className='navbar-item' href='/'>ModSaber</a>
        </div>
      </nav>
    )
  }
}

export default Navbar
