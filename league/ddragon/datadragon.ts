import needle from 'needle';

import globalState from '../../state';
import logger from '../../logging';
import lolcsui from '../../types';
import Spell = lolcsui.dto.Spell;

const log = logger('datadragon');

const realm = 'euw';

class DataDragon {
    versions: any;
    champions: any;
    summonerSpells: any;

    async init() {
        log.info('Getting latest versions from ddragon.');
        this.versions = (await needle('get', `https://ddragon.leagueoflegends.com/realms/${realm}.json`, { json: true })).body;

        globalState.data.meta.version = {
            champion: this.versions['n']['champion'],
            item: this.versions['n']['item']
        };
        globalState.data.meta.cdn = this.versions['cdn'];

        globalState.triggerUpdate();

        log.info(`Champion: ${globalState.data.meta.version.champion}, Item: ${globalState.data.meta.version.item}, CDN: ${globalState.data.meta.cdn}`);

        this.champions = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.champion}/data/en_US/champion.json`, { json: true })).body.data);
        log.info(`Loaded ${this.champions.length} champions`);

        this.summonerSpells = Object.values((await needle('get', `${globalState.data.meta.cdn}/${globalState.data.meta.version.item}/data/en_US/summoner.json`, { json: true })).body.data);
        log.info(`Loaded ${this.summonerSpells.length} summoner spells`);
    }

    getChampionById(id: number) {
        return this.champions.find((champion: { key: string; }) => {
            if (parseInt(champion.key, 10) === id) {
                return champion;
            }
        });
    }

    getSummonerSpellById(id: number) {
        return this.summonerSpells.find((spell: Spell) => {
            if (parseInt(<string>spell.key, 10) === id) {
                spell.icon = `${globalState.data.meta.cdn}/${globalState.data.meta.version.item}/img/spell/${spell.id}.png`;
                return spell;
            }
        });
    }
}

export default DataDragon;
