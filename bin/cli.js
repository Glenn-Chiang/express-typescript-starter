#!/usr/bin/env node

import child_process from 'child_process'
import path from 'path'
import fs from 'fs'
import ora from 'ora'
import { promisify } from 'util'

// Ensure that user provides project name as argument
if (process.argv.length < 3) {
  console.log("Please provide a project name")
  console.log('e.g. npx express-typescript-starter')
  process.exit(1)
}

const projectName = process.argv[2]
const projectPath = path.join(process.cwd(), projectName)
const git_repo = 'https://github.com/Glenn-Chiang/express-typescript-starter.git'

// Create project directory if current directory does not already contain a subdirectory with the given name
if (fs.existsSync(projectPath)) {
  console.log(`The current directory already contains a subdirectoy named ${projectName}`)
  console.log('Please choose a different project name')
  process.exit(1)
} else {
  fs.mkdirSync(projectPath)
}


try {
  // Clone git repo
  const gitSpinner = ora('Downloading source files...').start()
  await promisify(child_process.exec)(`git clone --depth 1 ${git_repo} ${projectPath} --quiet`)
  gitSpinner.succeed()

  const cleanSpinner = ora('Cleaning up...')
  // Remove git history
  const rmGit = asyncRm(path.join(projectPath, '.git'))
  // Remove this installation file
  const rmBin = asyncRm(path.join(projectPath, 'bin'))
  await Promise.all([rmGit, rmBin])

  // Remove dependencies needed for CLI
  process.chdir(projectPath)
  await promisify(child_process.exec)('npm uninstall ora')
  cleanSpinner.succeed()

  console.log('Your project has been created!')
  console.log('You can now run your app with:')
  console.log(`    cd ${projectName}`)
  console.log('    npm install')
  console.log('    npm run dev')
  
} catch (error) {
  fs.rmSync(projectPath, {recursive: true, force: true})
  console.log(error)
  process.exit(1)
}

function asyncRm(filepath) {
  const rm = promisify(fs.rm)
  return rm(filepath, {recursive: true, force: true})
}