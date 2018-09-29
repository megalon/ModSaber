import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'

import Field from '../form/Field.jsx'

class Mods extends Component {
  constructor (props) {
    super(props)

    this.state = { search: '' }

    this.fuseOptions = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 50,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        'name',
        'author',
      ],
    }
  }

  static propTypes = {
    children: PropTypes.any,
    mods: PropTypes.arrayOf(PropTypes.any),
    showMore: PropTypes.bool,
    showMoreClicked: PropTypes.func.isRequired,
    showApprovals: PropTypes.bool,
    authorLinks: PropTypes.bool,
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

    return [...categories]
  }

  render () {
    const filtered = this.state.search === '' ?
      this.props.mods :
      new Fuse(this.props.mods, this.fuseOptions)
        .search(this.state.search)

    const categories = this.categorize(filtered)

    const showMore = this.state.search === '' ? this.props.showMore : true
    const sliced = showMore ? categories : categories.slice(0, 1)

    if (this.props.mods.length === 0) {
      return (
        <Fragment>
          { this.props.children }
        </Fragment>
      )
    }

    return (
      <div className='content'>

        <Field
          type='text'
          value={ this.state.search }
          onChange={ e => this.setState({ search: e.target.value }) }
          icon='search'
          placeholder='Search mods...'
          autoComplete='off'
          autoCapitalize='off'
        />

        {
          !(sliced.length === 0 && this.state.search !== '') ?
            <ModsTable
              categories={ sliced }
              showApprovals={ this.props.showApprovals }
              authorLinks={ this.props.authorLinks }
            /> :
            <Fragment>
              <p>
                <b>No mods found!</b><br />
                <i>Try refining your search term.</i>
              </p>
            </Fragment>
        }

        {
          showMore ? null :
            <button
              onClick={ () => this.props.showMoreClicked() }
              className='button is-fullwidth is-dark is-inverted is-outlined'
            >Show More...</button>
        }
      </div>
    )
  }
}

const ModsTable = props =>
  <table className='is-fullwidth' style={{ marginTop: '-0.75rem' }}>
    <tbody>
      { props.categories.map(({ name, mods }) =>
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
                {
                  !props.authorLinks ?
                    <code style={{ color: '#060606' }}>{ mod.author }</code> :
                    <code style={{ color: '#060606' }}>
                      <Link to={ `/author/${mod.author}` }>{ mod.author }</Link>
                    </code>
                }
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
    </tbody>
  </table>

ModsTable.propTypes = {
  categories: PropTypes.any,
  showApprovals: PropTypes.bool,
  authorLinks: PropTypes.bool,
}

export default Mods
