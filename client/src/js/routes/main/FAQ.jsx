import React from 'react'
import { Helmet } from 'react-helmet'

import MainPage from '../../components/MainPage.jsx'

const FAQ = props =>
  <MainPage {...props} title='FAQ'>
    <Helmet>
      <title>ModSaber | FAQ</title>
    </Helmet>

    <hr />
    <h2 className='is-size-3 has-text-weight-semibold'>What is this place?</h2>
    <p>
      ModSaber is a repository for Beat Saber mods. Its aim is to organise mod releases and integrate directly with the Mod Installer.
    </p><br />

    <h2 className='is-size-3 has-text-weight-semibold'>How do I publish my mod?</h2>
    <p>
      Sign up for an account and verify by email, then you will be able to publish mods.
    </p><br />

    <h2 className='is-size-3 has-text-weight-semibold'>Does my mod have to be in a specific format?</h2>
    <p>
      <b>Yes</b>. Mods are required to be uploaded in a <code style={{ color: '#060606' }}>.zip</code> file
      representing the Beat Saber Directory. This is explained in further detail on the publish page.
    </p><br />

    <h2 className='is-size-3 has-text-weight-semibold'>My mod is listed as unapproved. What does this mean?</h2>
    <p>
      For security reasons, site admins have to approve new items uploaded to ModSaber to verify that nothing malicious got through the filter.
      This can take up to 24 hours <i>(maybe longer if we&#39;re lazy)</i> so just give it time. If your mod doesn&#39;t pass the security checks,
      it will be unpublished by an admin.
    </p><br />

    <h2 className='is-size-3 has-text-weight-semibold'>Who operates ModSaber?</h2>
    <p>
      ModSaber is developed and operated by <code style={{ color: '#060606' }}>lolPants#0001</code> on Discord.<br />
      Beta testing and creative input was also provided
      by <code style={{ color: '#060606' }}>
        Assistant#8431
      </code> and <code style={{ color: '#060606' }}>
        williams#0001
      </code> <span className='icon has-text-danger'>
        <i className='fas fa-heart' />
      </span><br /><br />

      A few other members of the Beat Saber Modding Community also have adminstrative access and can approve, transfer and unpublish any mod.
    </p><br />
  </MainPage>

export default FAQ
