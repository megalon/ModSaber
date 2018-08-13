import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

class Paginator extends Component {
  static propTypes = {
    max: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,

    next: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    goto: PropTypes.func.isRequired,
  }

  render () {
    let { max, current, next, prev, goto } = this.props
    if (max === 0) return null

    return (
      <nav className='pagination is-centered'>
        <a className='pagination-previous' onClick={ prev } disabled={ current === 0 }>Previous</a>
        <a className='pagination-next' onClick={ next } disabled={ current === max - 1 }>Next page</a>

        <ul className='pagination-list'>
          {
            max <= 5 ?
              <Fragment>
                {
                  Array.from(new Array(max)).map((_, i) =>
                    <li key={ i }>
                      <a className={ `pagination-link ${i === current ? 'is-current' : ''}` } onClick={ () => goto(i) }>{ i + 1 }</a>
                    </li>
                  )
                }
              </Fragment> :

              <Fragment>
                <li><a className={ `pagination-link ${current === 0 ? 'is-current' : ''}` } onClick={ () => goto(0) }>1</a></li>
                <li><span className='pagination-ellipsis'>&hellip;</span></li>

                {
                  current === 0 || current === max - 1 ?
                    <Other end={ current === max - 1 } max={ max } goto={ goto } /> :
                    current === 1 ?
                      <First goto={ goto } /> :
                      current === max - 2 ?
                        <Last goto={ goto } current={ current + 1 } /> :
                        <Fragment>
                          <li><a className='pagination-link' onClick={ () => goto(current - 1) }>{ current }</a></li>
                          <li><a className='pagination-link is-current' onClick={ () => goto(current) }>{ current + 1 }</a></li>
                          <li><a className='pagination-link' onClick={ () => goto(current + 1) }>{ current + 2 }</a></li>
                        </Fragment>
                }

                <li><span className='pagination-ellipsis'>&hellip;</span></li>
                <li><a className={ `pagination-link ${current === max - 1 ? 'is-current' : ''}` } onClick={ () => goto(max - 1) }>{ max }</a></li>
              </Fragment>
          }
        </ul>
      </nav>
    )
  }
}

const First = props =>
  <Fragment>
    <li><a className='pagination-link is-current' onClick={ () => props.goto(1) }>2</a></li>
    <li><a className='pagination-link' onClick={ () => props.goto(2) }>3</a></li>
    <li><a className='pagination-link' onClick={ () => props.goto(3) }>4</a></li>
  </Fragment>

First.propTypes = {
  goto: PropTypes.func.isRequired,
}

const Last = props =>
  <Fragment>
    <li><a className='pagination-link' onClick={ () => props.goto(props.current - 3) }>{ props.current - 2 }</a></li>
    <li><a className='pagination-link' onClick={ () => props.goto(props.current - 2) }>{ props.current - 1 }</a></li>
    <li><a className='pagination-link is-current' onClick={ () => props.goto(props.current - 1) }>{ props.current }</a></li>
  </Fragment>

Last.propTypes = {
  current: PropTypes.number.isRequired,
  goto: PropTypes.func.isRequired,
}

const Other = props => {
  let base = props.end ? props.max - 3 : 2
  return (
    <Fragment>
      <li><a className='pagination-link' onClick={ () => props.goto(base - 1) }>{ base }</a></li>
      <li><a className='pagination-link' onClick={ () => props.goto(base) }>{ base + 1 }</a></li>
      <li><a className='pagination-link' onClick={ () => props.goto(base + 1) }>{ base + 2 }</a></li>
    </Fragment>
  )
}

Other.propTypes = {
  end: PropTypes.bool.isRequired,
  max: PropTypes.number.isRequired,
  goto: PropTypes.func.isRequired,
}

export default Paginator
