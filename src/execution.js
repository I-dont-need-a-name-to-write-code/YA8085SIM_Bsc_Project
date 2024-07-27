

// make sure that the PC is set accordingly before calling this function.
const execute_next_instruction = (cpu_ctx) => {
    let instr = cpu_ctx.fetch_Byte();
    if(instr === INSTR_HLT) return false;
    if(!handle_instruction(cpu_ctx, instr)) {
        console.log("[ERROR] Invalid Instruction -> " + to_Hex2_Str(instr));
        return false;
    }
    return true;
};

const execute_program = (cpu_ctx, prog_addr) => {
    if(global.is_running) return false;
    cpu_ctx.reset();
    cpu_ctx.set_PC(prog_addr);
    global.is_running = true;
    global.runner_worker_handle.postMessage(JSON.stringify(cpu_ctx));
    return true;
}; 

const run_program = (cpu_ctx, code_str) => {
    let code = generate_machine_code(code_str); // [0] = start_addr | [1] = bytes(mc) array
    if(code === null) {
        alert("Machine Code Generation Failed");
        return null;
    }
    cpu_ctx.reset();
    cpu_ctx.memory.fill(0);
    for(let byte of code[1]) {
        cpu_ctx.set_Mem(byte.addr, byte.data);
    }
    if(!execute_program(cpu_ctx, code[0])) {
        alert("[Another program is already running!]\n[There may be an infinite loop!]");
    };
};

const terminate_program = () => {
    global.runner_worker_handle.terminate();
    global.is_running = false;
    global.cpu_ctx.reset();
    global.runner_worker_handle = new Worker("runner_worker.js");
    global.runner_worker_handle.onmessage = (msg_from_runner) => {
        let msg_data = JSON.parse(msg_from_runner.data);
        copy_CPU_Context(global.cpu_ctx, msg_data);
        global.cpu_ctx.log();
        global.is_running = false;
        update_register_window();
        alert("[Program Executed Successfully]");
    };
}