import { exec } from "child_process";

export class GitHubAgent {
  push(repo: string) {
    exec(`git init && git add . && git commit -m "NeuroEdge build" && git remote add origin ${repo} && git push -u origin main`);
  }
}
