#!/usr/bin/env node

const util = require("util")
const exec = util.promisify(require("child_process").exec)

const trimOutput = (output) => {
    let ret = output.replace(/\r/g, "").replace(/\n/g, "")
    ret = ret.split("/")
    return ret.slice(2).join("/")
}

const push = async (branch, tag, dryRun = true) => {
    let dryRunParam
    if (dryRun !== false) {
        dryRunParam = " --dry-run"
    }
    await exec(`git push origin ${branch}`, [dryRunParam])
    await exec(`git push origin ${tag}`, [dryRunParam])
}

const getCurrent = async (what) => {
    let ret
    try {
        let output = await exec(
            `git ${what} --points-at HEAD --format='%(refname)'`)

        if (output && output.stdout) {
            ret = output.stdout
        }

        let lines = ret.split("\n").filter((line) => {
            return line.trim() !== ""
        })

        if (lines.length > 1) {
            throw new Error(
                "This script is made only to be used by postversion in package.json")
        }
    } catch (ex) {
        console.error(`Failed to retrieve ${what}: \n`, ex.stdout || ex.message)
        process.exit(1)
        throw ex
    }
    return trimOutput(ret)
}

const main = async () => {
    let tag = await getCurrent("tag")
    let branch = await getCurrent("branch")

    if (!tag) {
        console.error("No tag can be found")
        process.exit(1)
        return
    }

    if (!branch) {
        console.error("No branch can be found")
        process.exit(1)
        return
    }

    console.log(`Current tag is: "${tag}"`)
    console.log(`Current branch is: "${branch}"`)

    console.log("Starting dry run...")

    try {
        await push(branch, tag)
    } catch (ex) {
        console.error("Failed to push: \n", ex.message, ex.stdout, ex.stderr)
        process.exit(1)
        return
    }

    console.log("Dry run succeed")

    console.log("Pushing...")

    await push(branch, tag, false)

    console.log("All pushed")
}

main()