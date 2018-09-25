import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Mods = props => {
  const categories = []
  for (let mod of props.mods) {
    const other = 'Other'
    const category = mod.category === '' ? other : mod.category

    if (!categories.find(x => x.name === category)) categories.push({ name: category, weight: 0, mods: [] })
    const current = categories.find(x => x.name === category)

    current.mods.push(mod)
    if (category !== other) current.weight += mod.weight
    else current.weight -= 10
  }

  categories.sort((a, b) => {
    const weight = b.weight - a.weight
    if (weight !== 0) return weight
    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  })

  const sliced = props.showMore ? categories : categories.slice(0, 1)

  if (sliced.length === 0) {
    return (
      <Fragment>
        <p>
          <b>Well this is embarrassing, it looks like there are no mods.</b><br />
          <i>If this isn&#39;t supposed to be the case, please alert a site admin.</i><br /><br />
          Otherwise, sign up and be the first to publish a mod!
        </p>
      </Fragment>
    )
  }

  return (
    <div className='content' style={{ marginTop: '-20px' }}>
      <table className='is-fullwidth'>
        { sliced.map(({ name, mods }) =>
          <Fragment key={ name }>
            <tr>
              <td
                className='is-size-3 has-text-weight-bold'
                colSpan={ !props.showApprovals ? 3 : 4 }
                style={{ paddingLeft: 0 }}
              >{ name }</td>
            </tr>

            <tr>
              <th className='is-size-5 has-text-weight-bold' style={{ paddingLeft: '10px' }}>Name</th>
              <th className='is-size-5 has-text-weight-bold'>Author</th>
              <th className='is-size-5 has-text-weight-bold'>Version</th>
              { !props.showApprovals ? null : <th className='is-size-5 has-text-weight-bold'>Approval Status</th> }
            </tr>

            { mods.map((mod, i) =>
              <tr key={ i }>
                <td>
                  <Link to={ `/mod/${mod.name}/${mod.version}` } className='mod-link'>
                    <span>{ mod.title }</span>
                  </Link>
                </td>

                <td>
                  <code style={{ color: '#060606' }}>{ mod.author }</code>
                </td>

                <td>
                  <code style={{ color: '#060606' }}>{ mod.name }@{ mod.version }</code>
                </td>

                { !props.showApprovals ? null :
                  <td>
                    <span className={ `tag is-${mod.approved ? 'link' : 'danger'}` }>
                      { mod.approved ? 'Approved' : 'UNAPPROVED' }
                    </span>
                  </td>
                }
              </tr>
            ) }
          </Fragment>
        ) }
      </table>

      {
        props.showMore ? null :
          <button
            onClick={ () => props.showMoreClicked() }
            className='button is-fullwidth is-dark is-inverted is-outlined'
          >Show More...</button>
      }
    </div>
  )
}

Mods.propTypes = {
  mods: PropTypes.arrayOf(PropTypes.any),
  showMore: PropTypes.bool,
  showMoreClicked: PropTypes.func.isRequired,
  showApprovals: PropTypes.bool,
}

export default Mods
