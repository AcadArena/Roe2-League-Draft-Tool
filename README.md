# lol-champselect-ui

UI to display the league of legends champion selection in esports tournaments.

## Features

- Connects to the League Client and fetches information about the current champ select in real time
- Automatically fetches champion loading images, splash arts and square icons from datadragon, which means that if a new champion
  is released it will automatically fetch the correct resources.
- Ready to use design templates:
  - Europe (similar to the pick&ban UI used in the LEC)
- Easy feature toggle (when using design templates) for:
  - Show / hide scores (usable if it's not best of 1)
  - Show / hide coaches
  - Show / hide summoner spells (usable in live matches on the live server where the enemy team is not supposed to see the summoner
    spells of the opposite team.
- Easy configuration:
  - Set team names
  - Set coach names
  - Set score
  - Set colors (default blue/red, but they can differ!)
- Allows to completely create a custom design based on web technologies (HTML, CSS & JS), including custom animations and
  transitions

### Replays (Playing a recorded champ select)

Replays are available. They are pretty useful to test your overlay with, since it mocks the data sources and simulates a draft phase, that has already passed. There are some recordings of replays in the "recordings" folder.

In order to play a replay that simulates a full tournament draft, please issue the following command to start the backend:

`yarn start:test`

While you are in a replay, you can focus the window and press "p" on your keyboard once, to pause or unpause the replay. This will freeze the current state, so you can adapt your design without having to hurry.

## Installation (Development purposes)

Please note: if you're looking for an easier installation, have a look at this project: https://github.com/FearNixx/vigilant-bans (the linked project is not associated or affiliated with the Riot Community Volunteers, and we can provide no warranty for the linked project)

1. Download and install Node.JS for Windows (or any other operating system): https://nodejs.org/download/release/v16.7.0/node-v16.7.0-x64.msi (please really install the linked version, 16.7.0, as otherwise you may run into issues)
1. Download and install yarn by running `npm i -g yarn`
1. Download or clone this Git-Repository to your local machine.
1. Run setup.ps1 from the root folder of this repository. This will install all required dependencies and build the project.
1. Run `start (run as admin).ps1` file as administrator. This will start the backend and the frontend.
1. The overlay should run in localhost:1337

### Connection to League Client failed (Unhandled PromiseRejectionWarning: TypeError: Cannot read property "port" of undefined)

The above outlined error happens, if a connection to the League Client cannot be established. So make sure that your League Client is running. We noticed that for some servers (mainly ones not run by Riot Games) the Client process runs as administrator, and therefore you also need to execute this tool as administrator, as otherwise the LeagueClient cannot be accessed. So when you open up the powershell, instead of doing the Shift + Rightclick thingy, open it directly (search for Powershell) but rightclick it and select "Open as Administrator". Then, navigate to the folder where you have the files in using the command `cd {folder}`. Then try again to start it, using `yarn start`.

## Legal disclaimer

lol-pick-ban-ui was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
However, Riot was informed and has confirmed that this project is compliant with their ToS.
