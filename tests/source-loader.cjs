const fs = require("node:fs")
const path = require("node:path")
const Module = require("node:module")
const ts = require("typescript")

// Execute the application's TypeScript itself, injecting only service boundaries.
function loadSource(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, "..", relative)
  if (cache.has(filename)) return cache.get(filename).exports
  const instance = new Module(filename, module)
  instance.filename = filename
  instance.paths = Module._nodeModulePaths(path.dirname(filename))
  cache.set(filename, instance)
  const nativeRequire = instance.require.bind(instance)
  instance.require = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id]
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(filename), id)
      if (mocks[base]) return mocks[base]
      const candidate = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((file) => fs.existsSync(file) && fs.statSync(file).isFile())
      if (candidate && /\.tsx?$/.test(candidate)) return loadSource(path.relative(path.resolve(__dirname, ".."), candidate), mocks, cache)
    }
    return nativeRequire(id)
  }
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } })
  instance._compile(output.outputText, filename)
  return instance.exports
}

const sdk = {
  createStep: (_name, invoke, compensate) => ({ invoke, compensate }),
  createWorkflow: (_name, compose) => ({ compose }),
  StepResponse: class { constructor(result, compensation) { this.result = result; this.compensation = compensation } },
  WorkflowResponse: class { constructor(result) { this.result = result } },
}
function response() {
  return { statusCode: 200, headers: {}, status(value) { this.statusCode = value; return this }, json(value) { this.body = value; return this }, setHeader(key, value) { this.headers[key] = value } }
}
module.exports = { loadSource, sdk, response }
