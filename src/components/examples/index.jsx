import React from 'react'
import { Routes } from '@gem-mine/durex'
import Footer from './Footer'
import Header from './Header'
import style from './style'

export default props => {
  return (
    <div className={style.container}>
      <Header />
      <div className={style.body}>
        <Routes path="examples" />
      </div>
      <Footer />
    </div>
  )
}
