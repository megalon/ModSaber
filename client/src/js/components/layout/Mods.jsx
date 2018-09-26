import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Mods extends Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
    }
  }

  static propTypes = {
    children: PropTypes.any,
    mods: PropTypes.arrayOf(PropTypes.any),
    showMore: PropTypes.bool,
    showMoreClicked: PropTypes.func.isRequired,
    showApprovals: PropTypes.bool,
  }

  categorize (mods) {
    const categories = []
    for (let mod of mods) {
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

    return categories
  }

  render () {
    const categories = this.categorize(this.props.mods)
    const sliced = this.props.showMore ? categories : categories.slice(0, 1)

    if (sliced.length === 0) {
      return (
        <Fragment>
          { this.props.children }
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
                  colSpan={ !this.props.showApprovals ? 3 : 4 }
                  style={{ paddingLeft: 0 }}
                >{ name }</td>
              </tr>

              <tr>
                <th className='is-size-5 has-text-weight-bold' style={{ paddingLeft: '10px' }}>Name</th>
                <th className='is-size-5 has-text-weight-bold'>Author</th>
                <th className='is-size-5 has-text-weight-bold'>Version</th>
                { !this.props.showApprovals ? null : <th className='is-size-5 has-text-weight-bold'>Approval Status</th> }
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

                  { !this.props.showApprovals ? null :
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
          this.props.showMore ? null :
            <button
              onClick={ () => this.props.showMoreClicked() }
              className='button is-fullwidth is-dark is-inverted is-outlined'
            >Show More...</button>
        }
      </div>
    )
  }
}

export default Mods
