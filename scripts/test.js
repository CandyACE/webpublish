const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const { prompt, MultiSelect } = require('enquirer')
const execa = require('execa')
const pkg = require('../package.json')

const currentVersion = pkg.version
const preId =
  args.preId ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const isDryRun = args.dry;
const skipTests = args.skipTest;
const skipBuild = args.skipBuild;

const pkgPath = path.resolve(__dirname, '../package.json')
const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
]

const inc = (i) => semver.inc(currentVersion, i, preId);
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const step = (msg) => console.log(chalk.cyan(msg));

async function main() {
  const { stdout } = await run('git', ['cherry'], { stdio: 'pipe' });
  var list = stdout.split('\n').map(e => e.replace('+ ', ''))
  var commit = []
  for (let i = 0; i < list.length; i++) {
    const commitid = list[i];
    const { stdout } = await run('git', ['show', '--quiet', commitid], { stdio: 'pipe' })
    var commitList = stdout.split('\n').map(e => e.replace(/(^\s*)/g, "").replace(/(\s*$)/g, ""));
    commitList.splice(0, 4);
    commit.push(...commitList)
  }
  console.log(commit)

  const prom = new MultiSelect({
    name: "updateMessage",
    message: "Select Update Messages: ",
    choices: commit
  })
  const updateMessage = await prom.run();
  console.log(updateMessage)
}

main().catch((err) => {
  console.error(err);
});
