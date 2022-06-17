import React from "react"
import cx from "classnames"
import Pick from "./Pick"

import css from "./style/index.module.scss"
import Ban from "./Ban"

import left from "../assets/left-arrow.png"
import right from "../assets/right-arrow.png"
import bg from "../assets/bg.png"
import front from "../assets/front.png"

export default class Overlay extends React.Component {
  state = {
    currentAnimationState: css.TheAbsoluteVoid,
    openingAnimationPlayed: false,
  }

  playOpeningAnimation() {
    this.setState({ openingAnimationPlayed: true })
    setTimeout(() => {
      this.setState({ currentAnimationState: css.AnimationHidden })

      setTimeout(() => {
        this.setState({
          currentAnimationState:
            css.AnimationTimer + " " + css.AnimationBansPick,
        })

        setTimeout(() => {
          this.setState({
            currentAnimationState:
              css.AnimationBansPick + " " + css.AnimationBansPickOnly,
          })

          setTimeout(() => {
            this.setState({ currentAnimationState: css.AnimationPigs })
          }, 1000)
        }, 1450)
      }, 700)
    }, 500)
  }

  render() {
    const { state, config } = this.props

    if (state.champSelectActive && !this.state.openingAnimationPlayed) {
      this.playOpeningAnimation()
    }

    if (!state.champSelectActive && this.state.openingAnimationPlayed) {
      this.setState({ openingAnimationPlayed: false })
      this.setState({ currentAnimationState: css.TheAbsoluteVoid })
    }

    console.log(state)

    const renderBans = (teamState, space) => {
      const list = teamState.bans.map((ban, idx) => (
        <Ban key={`ban-${idx}`} {...ban} />
      ))
      list.splice(space, 0, <div key="ban-spacer" className={css.Spacing} />)
      return <div className={cx(css.BansBox)}>{list}</div>
    }

    const renderTeam = (teamName, teamConfig, teamState) => (
      <div className={cx(css.Team, teamName)}>
        <div className={cx(css.Picks)}>
          {teamState.picks.map((pick, idx) => (
            <Pick key={`pick-${idx}`} config={this.props.config} {...pick} />
          ))}
        </div>
        <div className={css.BansWrapper}>
          <div className={cx(css.Bans)}>
            {teamName === css.TeamRed && renderBans(teamState, 2)}
            {teamName === css.TeamBlue && renderBans(teamState, 3)}
          </div>
        </div>
      </div>
    )

    return (
      <div
        className={cx(
          css.Overlay,
          css.Europe,
          this.state.currentAnimationState
        )}
        style={{
          "--color-red": config.frontend.redTeam.color,
          "--color-blue": config.frontend.blueTeam.color,

          position: "absolute",
          top: 0,
          left: 0,
          height: 1080,
          width: 1920,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 1080,
            width: 1920,
            backgroundImage: `url("${bg}")`,
            backgroundSize: "100% 100%",
            zIndex: 2,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 1080,
            width: 1920,
            backgroundImage: `url("${front}")`,
            backgroundSize: "100% 100%",
            zIndex: 9999,
          }}
        ></div>
        {Object.keys(state).length === 0 && (
          <div className={cx(css.infoBox)}>
            Not connected to backend service!
          </div>
        )}
        {Object.keys(state).length !== 0 && (
          <div className={cx(css.ChampSelect)}>
            {!state.leagueConnected && (
              <div className={cx(css.infoBox)}>Not connected to client!</div>
            )}
            <div className={cx(css.MiddleBox)}>
              <div
                className={cx(css.Timer, {
                  [`${css.Red} ${css.Blue}`]:
                    !state.blueTeam.isActive && !state.redTeam.isActive,
                  [css.Blue]: state.blueTeam.isActive,
                  [css.Red]: state.redTeam.isActive,
                })}
                style={{}}
              >
                <div
                  className={cx(css.Background, css.Blue)}
                  style={{
                    backgroundImage: `url("${left}")`,

                    opacity:
                      state.blueTeam.isActive && !state.redTeam.isActive
                        ? 1
                        : 0,
                  }}
                />
                <div
                  className={cx(css.Background, css.Red)}
                  style={{
                    backgroundImage: `url("${right}")`,
                    opacity:
                      !state.blueTeam.isActive && state.redTeam.isActive
                        ? 1
                        : 0,
                  }}
                />
                {state.timer < 100 && (
                  <div className={cx(css.TimerChars)}>
                    {state.timer
                      .toString()
                      .split("")
                      .map((char, idx) => (
                        <div key={`div-${idx}`} className={cx(css.TimerChar)}>
                          {char}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              {state.timer >= 100 && (
                <div className={cx(css.TimerChars)}>{state.timer}</div>
              )}
              <div className={cx(css.Patch)}>{state.state}</div>
            </div>
            {renderTeam(css.TeamBlue, config.frontend.blueTeam, state.blueTeam)}
            {renderTeam(css.TeamRed, config.frontend.redTeam, state.redTeam)}
          </div>
        )}
      </div>
    )
  }
}
