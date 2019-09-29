import league from '../league';
import lolcsui from '../types';
import Cell = lolcsui.lcu.Cell;
import Action = lolcsui.lcu.Action;
import ActionType = lolcsui.lcu.ActionType;
import Ban = lolcsui.dto.Ban;
import Team = lolcsui.dto.Team;
import Pick = lolcsui.dto.Pick;
import Session = lolcsui.lcu.Session;
import Champion = lolcsui.dto.Champion;
import Timer = lolcsui.lcu.Timer;

const convertTeam = (team: Array<Cell>, actions: Array<Action>, name: string) => {
    const newTeam = new Team();
    newTeam.picks = team.map((cell: Cell) => {
        const currentAction = actions[actions.length - 1];
        console.log(currentAction);

        const pick = new Pick(cell.cellId);
        pick.id = cell.cellId;
        pick.isActive = false;

        const spell1 = league.ddragon.getSummonerSpellById(cell.spell1Id);
        pick.spell1 = {
            id: cell.spell1Id,
            icon: spell1 ? spell1.icon : ''
        };

        const spell2 = league.ddragon.getSummonerSpellById(cell.spell2Id);
        pick.spell2 = {
            id: cell.spell2Id,
            icon: spell2 ? spell2.icon : ''
        };

        const champion = league.ddragon.getChampionById(cell.championId);
        pick.champion = {
            id: cell.championId,
            name: champion ? champion.name : '',
            idName: champion ? champion.id : '',
            loadingImg: champion ? champion.loadingImg : '',
            splashImg: champion ? champion.splashImg : '',
            squareImg: champion ? champion.squareImg : ''
        };

        const summoner = league.lcu.getSummonerById(cell.summonerId);
        if (summoner) {
            pick.displayName = summoner.displayName;
        }

        if (currentAction.type === ActionType.PICK && currentAction.actorCellId === cell.cellId && !currentAction.completed) {
            console.log("Currently active is team " + name);
            console.log(team);
            pick.isActive = true;
            newTeam.isActive = true;
        }

        return pick;
    });

    const isInThisTeam = (cellId: number) => {
        return team.filter(cell => cell.cellId === cellId).length !== 0;
    };

    newTeam.bans = actions.filter(action => action.type === ActionType.BAN && isInThisTeam(action.actorCellId)).map(action => {
        const ban = new Ban();

        if (!action.completed) {
            ban.isActive = true;
            newTeam.isActive = true;
            ban.champion = new Champion();
            return ban;
        }

        const champion = league.ddragon.getChampionById(action.championId);
        ban.champion = {
            id: action.championId,
            name: champion ? champion.name : '',
            idName: champion ? champion.id : '',
            loadingImg: champion ? champion.loadingImg : '',
            splashImg: champion ? champion.splashImg : '',
            squareImg: champion ? champion.squareImg : ''
        };

        return ban;
    });

    return newTeam;
};

const convertTimer = (timer: Timer) => {
    const startOfPhase = timer.internalNowInEpochMs;
    const expectedEndOfPhase = startOfPhase + timer.adjustedTimeLeftInPhase;

    const countdown = expectedEndOfPhase - new Date().getTime();
    const countdownSec = Math.floor(countdown / 1000);

    if (countdownSec < 0) {
        return 0;
    }
    return countdownSec;
};

const convertState = (lcuSession: Session) => {
    // @ts-ignore
    const flattenedActions: Array<Action> = [].concat(...lcuSession.actions);

    const blueTeam = convertTeam(lcuSession.myTeam, flattenedActions, 'blueTeam');
    const redTeam = convertTeam(lcuSession.theirTeam, flattenedActions, 'redTeam');

    const timer = convertTimer(lcuSession.timer);

    return {
        blueTeam,
        redTeam,
        timer
    };
};

export default convertState;
