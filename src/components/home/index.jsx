import React from 'react'
import { urlFor, Link } from '@gem-mine/durex'
import style from './style'
import logo from './logo.png'

export default props => {
  return (
    <div className={style.main}>
      <div>
        <img className={style.logo} src={logo} alt="logo" />
      </div>
      <h2 className={style.title}>welcome to sapphire! </h2>
      <p>希望在这里可以挖到属于你的宝藏 💎</p>
      <Link className={style.examples} to={urlFor('examples')}>
        这里有一些简单的例子 go!
      </Link>
    </div>
  )
}
