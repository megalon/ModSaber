import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import MainPage from '../components/MainPage.jsx'

class PrivacyPolicy extends Component {
  render () {
    return (
      <MainPage {...this.props} title='Privacy'>
        <Helmet>
          <title>ModSaber | Privacy</title>
        </Helmet>

        <hr />
        <h2 className='is-size-3 has-text-weight-semibold'>User Data</h2>
        <p>
          Passwords are stored in the database after being hashed using the <code style={{ color: '#060606' }}>pbkdf2</code> algorithm
          with 25000 iterations, along with a random salt.<br />

          Emails are stored in <b>plain text</b>. This is so we can email you for verification and password resets.
          We will <b>never</b> send you spam emails.
        </p><br />

        <h2 className='is-size-3 has-text-weight-semibold'>Use of Cookies</h2>
        <p>
          This site uses cookies to keep track of login status.
          If you&#39;re logged in you will have a cookie containing your authentication token.
        </p><br />

        <h2 className='is-size-3 has-text-weight-semibold'>Uploads</h2>
        <p>
          Anything published to ModSaber will be publicly accessable and can be unpublished at any time.
          Unpublishing only removes references to an item in the database, the files will still be available to download.<br />
          <b>If you wish for a file to be deleted, please contact a site admin.</b> Please do not upload anything you do not wish to be public.
        </p><br />
      </MainPage>
    )
  }
}

export default PrivacyPolicy
