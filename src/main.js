
let global = {
    cpu_ctx: new CPU_Context(),
    runner_worker_handle: new Worker("runner_worker.js"),
    is_running: false,
    is_paused: false,
};

global.runner_worker_handle.onmessage = (msg_from_runner) => {
    let msg_data = JSON.parse(msg_from_runner.data);
    copy_CPU_Context(global.cpu_ctx, msg_data);
    global.cpu_ctx.log();
    global.is_running = false;
};

const execute_program = (cpu, prog_addr) => {
    if(global.is_running) return false;
    cpu.reset();
    cpu.set_PC(prog_addr);
    global.is_running = true;
    global.runner_worker_handle.postMessage(JSON.stringify(cpu));
    return true;
}; 

let prog_start = 0xF000;
prog = [
    INSTR_MVI_A, 0x44,
    INSTR_MVI_B, 0x42,
    INSTR_ADD_B,
    INSTR_DAA,
    INSTR_HLT
];

const main = () => {
    global.cpu_ctx.copy_To_Mem(prog_start, prog);
    execute_program(global.cpu_ctx, prog_start);
};

main();

