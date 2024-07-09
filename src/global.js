
let global = {
    cpu_ctx: new CPU_Context(),
    runner_worker_handle: new Worker("runner_worker.js"),
    is_running: false,
    is_paused: false,
    is_compiled: false,
    is_runned: false
};
