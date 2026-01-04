export class Logger {
  constructor(private level: "debug" | "info" | "warn" | "error", private prefix?: string) {}

  private log(msg: string, type: string) {
    console.log(`[${type.toUpperCase()}]${this.prefix ? "[" + this.prefix + "]" : ""}: ${msg}`);
  }

  debug(msg: string) { if (["debug"].includes(this.level)) this.log(msg, "debug"); }
  info(msg: string) { if (["debug","info"].includes(this.level)) this.log(msg, "info"); }
  warn(msg: string) { if (["debug","info","warn"].includes(this.level)) this.log(msg, "warn"); }
  error(msg: string) { this.log(msg, "error"); }
}
