import React from "react"
import cx from "classnames"

import css from "./style/index.module.scss"

const Bans = (props) => (
  <div className={cx(css.Ban)}>
    <div
      className={cx(css.BanImage, {
        [css.Active]: props.isActive,
      })}
      style={{
        backgroundImage: `url("${props.champion.squareImg}")`,
        backgroundSize: "cover",
        height: 62,
        width: 62,
        backgroundPosition: "bottom",
      }}
    ></div>
  </div>
)

export default Bans
