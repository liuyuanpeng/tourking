import React from 'react'
import { urlFor, Link } from '@gem-mine/durex'
import style from '../style'

export default props => {
  return (
    <div>
      <span>yyyyy </span>
      <Link className={style.link} to={urlFor('examples.permission.x')}>
        goto page X
      </Link>
    </div>
  )
}
