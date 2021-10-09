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
  let targetVersion = args._[0];

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map((i) => `${i} (${inc(i)})`)
        .concat(['custom']),
    });

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    return;
  }

  step("\nGetUpdate Message...")
  var updateMessage = []
  const cherry = await run('git', ['cherry'], { stdio: 'pipe' });
  var list = cherry.stdout.split('\n').map(e => e.replace('+ ', ''))
  var commit = []
  for (let i = 0; i < list.length; i++) {
    const commitid = list[i];
    const show = await run('git', ['show', '--quiet', commitid], { stdio: 'pipe' })
    var commitList = show.stdout.split('\n').map(e => e.replace(/(^\s*)/g, "").replace(/(\s*$)/g, ""));
    commitList.splice(0, 4);
    commit.push(...commitList)
  }

  const prom = new MultiSelect({
    name: "updateMessage",
    message: "Select Update Messages: ",
    choices: commit
  })
  updateMessage = await prom.run();

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...');
  if (!isDryRun) {
    pkg.version = targetVersion;
    if (updateMessage.length <= 0) {
      updateMessage.push('修复若干问题');
    }
    pkg.build.publish[0].updateInfos = updateMessage;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  } else {
    console.log(`(skipped)`);
  }

  // // run tests before release
  // step('\nRunning tests...');
  // if (!skipTests && !isDryRun) {
  //   await run('npm', ['test']);
  // } else {
  //   console.log(`(skipped)`);
  // }

  // build package
  step('\nBuilding package...');
  if (!skipBuild && !isDryRun) {
    await run('npm', ['run', 'build']);
  } else {
    console.log(`(skipped)`);
  }

  // generate changelog
  await run(`npm`, ['run', 'changelog']);

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`]);
  } else {
    console.log('No changes to commit.');
  }

  // push to GitHub
  step('\nPushing to GitHub and Gitee...');
  await runIfNotDry('git', ['tag', `v${targetVersion}`]);
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
  await runIfNotDry('git', ['push']);

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  }

  console.log();
}

main().catch((err) => {
  console.error(err);
});
